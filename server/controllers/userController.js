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
    created_at: u.accountCreatedAt instanceof Date
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

async function updateUserProfile(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    // API fields allowed
    const allowedFields = ["username", "fname", "lname", "email"];
    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: `No valid fields to update. Allowed: ${allowedFields.join(", ")}`,
      });
    }

    // Validate
    for (const [k, v] of Object.entries(updates)) {
      if (typeof v !== "string") {
        return res.status(400).json({ success: false, error: `${k} must be a string` });
      }
    }

    // Map API -> DB
    const dbUpdates = {};
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.fname !== undefined) dbUpdates.firstName = updates.fname;
    if (updates.lname !== undefined) dbUpdates.lastName = updates.lname;
    if (updates.email !== undefined) dbUpdates.email = updates.email;

    const result = await db.updateUser(userId, dbUpdates);
    if (!result?.matchedCount) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updatedUser = await db.getUser(userId);

    return res.json({
      success: true,
      message: "Profile updated",
      data: mapUser(updatedUser),
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to update user profile",
    });
  }
}

module.exports = {
  createContract,
  getUserProfile,
  getUserByEmail,
  updateUserProfile,
};
