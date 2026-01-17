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

function getPublicContracts(req, res) {
  try {
    const { page = 1, limit = 20, search, username } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (Number.isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ success: false, error: "page must be >= 1" });
    }
    if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res
        .status(400)
        .json({ success: false, error: "limit must be between 1 and 100" });
    }

    // TODO: Database logic goes here (pagination + search)

    return res.json({
      success: true,
      message: "List of all public contracts",
      page: pageNum,
      limit: limitNum,
      filters: { search: search || null, username: username || null },
      data: [], // TODO
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch public contracts",
    });
  }
}

function getContractById(req, res) {
  try {
    const { contractId } = req.params;

    if (!contractId) {
      return res.status(400).json({ success: false, error: "Missing contractId" });
    }

    // TODO: Database logic goes here
    return res.json({
      success: true,
      message: `Information for contract ${contractId}`,
      contractId,
      data: null, // TODO
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch contract",
    });
  }
}

function getContractsByUser(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    // TODO: Database logic goes here
    return res.json({
      success: true,
      message: `List of contracts created and taken by user ${userId}`,
      userId,
      data: [], // TODO
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch user's contracts",
    });
  }
}

function claimContract(req, res) {
  try {
    const { contractId } = req.params;
    const { claimingUserId } = req.body;

    if (!contractId) {
      return res.status(400).json({ success: false, error: "Missing contractId" });
    }
    if (!claimingUserId) {
      return res
        .status(400)
        .json({ success: false, error: "claimingUserId is required" });
    }

    // TODO: Database logic goes here (ensure contract is public/unclaimed, etc.)
    return res.json({
      success: true,
      message: `Contract ${contractId} has been claimed`,
      contractId,
      claimedBy: claimingUserId,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to claim contract",
    });
  }
}

module.exports = {
  getPublicContracts,
  getContractById, 
  getContractsByUser,
  claimContract,
};