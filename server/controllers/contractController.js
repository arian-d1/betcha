// Logic for handling contract data

// function testFunction(req, res) {
//   try {
//     return res.json("Message");
//   } catch (e) {
//     return res.json({
//       success: false,
//       error: e.message || "Test Error",
//     });
//   }
// }

const db = require("../db/queries");

function mapContract(c) {
  return {
    id: c.id,
    maker: c.maker,
    taker: c.taker ?? null,
    title: c.title,
    description: c.description,
    amount: Number(c.amount),
    status: c.status,
    winner: c.winner ?? null,
    created_at:
      c.created_at instanceof Date ? c.created_at.toISOString() : c.created_at,
  };
}

async function getPublicContracts(req, res) {
  try {
    const { page = 1, limit = 20, search, username } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (Number.isNaN(pageNum) || pageNum < 1) {
      return res
        .status(400)
        .json({ success: false, error: "page must be >= 1" });
    }
    if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res
        .status(400)
        .json({ success: false, error: "limit must be between 1 and 100" });
    }

    // Database logic goes here (pagination + search)
    const { data, total } = await db.listPublicContracts({
      page: pageNum,
      limit: limitNum,
      search: search || null,
      username: username || null,
    });

    return res.json({
      success: true,
      message: "List of all public contracts",
      page: pageNum,
      limit: limitNum,
      total,
      filters: { search: search || null, username: username || null },
      data: data.map(mapContract),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch public contracts",
    });
  }
}

async function getContractById(req, res) {
  try {
    const { contractId } = req.params;

    if (!contractId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing contractId" });
    }

    const contract = await db.getContract(contractId);

    if (!contract) {
      return res
        .status(404)
        .json({ success: false, error: "Contract not found" });
    }

    return res.json({
      success: true,
      message: `Information for contract ${contractId}`,
      contractId,
      data: mapContract(contract),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch contract",
    });
  }
}

async function getContractsByUser(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const contracts = await db.getContractsByUser(userId);

    return res.json({
      success: true,
      message: `List of contracts created and taken by user ${userId}`,
      userId,
      data: contracts.map(mapContract),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch user's contracts",
    });
  }
}

async function claimContract(req, res) {
  try {
    const { contractId } = req.params;
    const { claimingUserId } = req.body;

    if (!contractId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing contractId" });
    }
    if (!claimingUserId) {
      return res
        .status(400)
        .json({ success: false, error: "claimingUserId is required" });
    }

    // 1) Get contract to know amount + validate state
    const contract = await db.getContract(contractId);
    if (!contract) {
      return res.status(404).json({ success: false, error: "Contract not found" });
    }
    if (contract.status !== "open") {
      return res.status(409).json({
        success: false,
        error: "Contract cannot be claimed (not open)",
      });
    }
    if (contract.taker != null) {
      return res.status(409).json({
        success: false,
        error: "Contract cannot be claimed (already claimed)",
      });
    }
    if (contract.maker === claimingUserId) {
      return res.status(400).json({
        success: false,
        error: "You cannot claim your own contract",
      });
    }

    const amountNum = Number(contract.amount ?? 0);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({
        success: false,
        error: "Contract has invalid amount",
      });
    }

    // 2) Ensure claimant has enough balance, then deduct
    const claimant = await db.getUser(claimingUserId);
    if (!claimant) {
      return res.status(404).json({ success: false, error: "Claiming user not found" });
    }

    const currentBalance = Number(claimant.balance ?? 0);
    if (currentBalance < amountNum) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance to accept this wager",
      });
    }

    const newBalance = currentBalance - amountNum;
    await db.updateUser(claimingUserId, { balance: newBalance });

    // 3) Claim the contract (sets taker + status)
    const result = await db.claimContract(contractId, claimingUserId);
    const updated = result?.value ?? null;

    // If claim failed (race condition), refund the user (best-effort)
    if (!updated) {
      await db.updateUser(claimingUserId, { balance: currentBalance });
      return res.status(409).json({
        success: false,
        error:
          "Contract cannot be claimed (not found, not open, or already claimed)",
      });
    }

    return res.json({
      success: true,
      message: "Contract claimed",
      data: mapContract(updated),
      balance: newBalance,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to claim contract",
    });
  }
}

async function cancelContract(req, res) {
  try {
    const { contractId } = req.params;
    const { userId } = req.body; // MVP: who is cancelling

    if (!contractId) {
      return res.status(400).json({ success: false, error: "Missing contractId" });
    }
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }

    const contract = await db.getContract(contractId);
    if (!contract) {
      return res.status(404).json({ success: false, error: "Contract not found" });
    }

    // MVP sanity checks
    if (contract.maker !== userId) {
      return res.status(403).json({ success: false, error: "Only maker can cancel" });
    }
    if (contract.status !== "open") {
      return res.status(409).json({ success: false, error: "Contract cannot be cancelled" });
    }
    if (contract.taker != null) {
      return res.status(409).json({ success: false, error: "Claimed contract cannot be cancelled" });
    }

    const amountNum = Number(contract.amount ?? 0);

    // 1) mark cancelled
    await db.updateContract(contractId, { status: "cancelled" });

    // 2) refund maker balance
    const user = await db.getUser(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const refundedBalance = Number(user.balance ?? 0) + amountNum;
    await db.updateUser(userId, { balance: refundedBalance });

    const updatedContract = await db.getContract(contractId);

    return res.json({
      success: true,
      message: "Contract cancelled",
      data: {
        contract: mapContract(updatedContract),
        balance: refundedBalance,
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to cancel contract",
    });
  }
}

module.exports = {
  getPublicContracts,
  getContractById,
  getContractsByUser,
  claimContract,
  cancelContract
};
