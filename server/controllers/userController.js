// Logic for user specific actions

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

const crypto = require("crypto");
const db = require("../db/queries");

function mapUser(u) {
  return {
    id: u.uuid,
    username: u.username ?? null,
    fname: u.firstName ?? null,
    lname: u.lastName ?? null,
    email: u.email ?? null,
    created_at:
      u.accountCreatedAt instanceof Date
        ? u.accountCreatedAt.toISOString()
        : u.accountCreatedAt,
    balance: Number(u.balance ?? 0),
    times_banned: Number(u.timesBanned ?? 0),
  };
}

async function createContract(req, res) {
  try {
    const { userId } = req.params;
    const { contractTitle, contractDescription, contractAmount } = req.body;

    // Basic validation (optional but helpful)
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }
    if (!contractTitle || typeof contractTitle !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "contractTitle is required (string)" });
    }
    if (!contractDescription || typeof contractDescription !== "string") {
      return res.status(400).json({
        success: false,
        error: "contractDescription is required (string)",
      });
    }
    const amountNum = Number(contractAmount);
    if (contractAmount == null || Number.isNaN(amountNum)) {
      return res
        .status(400)
        .json({ success: false, error: "contractAmount is required (number)" });
    }

    const contract = {
      id: crypto.randomUUID(),
      maker: userId,
      taker: null,
      title: contractTitle,
      description: contractDescription,
      amount: amountNum,
      status: "open",
      winner: null,
      created_at: new Date(),
    };

    await db.createContract(contract);

    return res.status(201).json({
      success: true,
      message: "New contract created",
      data: contract,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to create contract",
    });
  }
}

async function getUserProfile(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const user = await db.getUser(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, data: mapUser(user) });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch user profile",
    });
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "email query param is required" });
    }

    const user = await db.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.json({ success: true, data: mapUser(user) });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch user by email",
    });
  }
}

async function updateUsername(req, res) {
  try {
    const { userId } = req.params;
    const { username } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    if (typeof username !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "username is required (string)" });
    }

    const nextUsername = username.trim();
    if (!nextUsername) {
      return res
        .status(400)
        .json({ success: false, error: "username cannot be empty" });
    }

    // Check if username is already taken (by someone else)
    const existing = await db.getUserByUsername(nextUsername);
    if (existing && existing.uuid !== userId) {
      return res.status(409).json({
        success: false,
        error: "username is already taken",
      });
    }

    const result = await db.updateUser(userId, { username: nextUsername });
    if (!result?.matchedCount) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updatedUser = await db.getUser(userId);

    return res.json({
      success: true,
      message: "Username updated",
      data: mapUser(updatedUser),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to update username",
    });
  }
}

async function updateBalance(req, res) {
  try {
    const { userId } = req.params;
    const { balance } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const nextBalance = Number(balance);
    if (balance == null || Number.isNaN(nextBalance)) {
      return res
        .status(400)
        .json({ success: false, error: "balance is required (number)" });
    }

    // MVP: allow 0+ only (change/remove if you want to allow negative)
    if (nextBalance < 0) {
      return res
        .status(400)
        .json({ success: false, error: "balance cannot be negative" });
    }

    const result = await db.updateUser(userId, { balance: nextBalance });
    if (!result?.matchedCount) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updatedUser = await db.getUser(userId);

    return res.json({
      success: true,
      message: "Balance updated",
      data: mapUser(updatedUser),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to update balance",
    });
  }
}

module.exports = {
  createContract,
  getUserProfile,
  getUserByEmail,
  updateUsername,
  updateBalance,
};
