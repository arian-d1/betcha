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

function createContract(req, res) {
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
    if (contractAmount == null || Number.isNaN(Number(contractAmount))) {
      return res
        .status(400)
        .json({ success: false, error: "contractAmount is required (number)" });
    }

    // TODO: Database logic goes here

    return res.status(201).json({
      success: true,
      message: "New contract created",
      creatorId: userId,
      data: {
        contractTitle,
        contractDescription,
        contractAmount: Number(contractAmount),
      },
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to create contract",
    });
  }
}

function getUserProfile(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    // const user = {
    //   id: userId,
    //   username: "placeholder_username",
    //   fname: "First",
    //   lname: "Last",
    //   email: "user@example.com",
    //   created_at: new Date().toISOString(),
    //   balance: 0,
    //   times_banned: 0,
    // };

    // TODO: Replace with DB lookup
    // TODO: user = ...

    return res.json({ success: true, data: user });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch user profile",
    });
  }
}

function getUserByEmail(req, res) {
  try {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "email query param is required" });
    }

    // const updatedUser = {
    //   id: userId,
    //   username: "placeholder_username",
    //   fname: "First",
    //   lname: "Last",
    //   email: "user@example.com",
    //   created_at: new Date().toISOString(),
    //   balance: 0,
    //   times_banned: 0,
    // };

    // TODO: Replace with DB lookup by email
    // TODO: const user = ...;

    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    return res.json({ success: true, data: user });
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e?.message || "Failed to fetch user by email",
    });
  }
}

function updateUserProfile(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

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

    // Basic validation
    if (
      updates.username !== undefined &&
      typeof updates.username !== "string"
    ) {
      return res
        .status(400)
        .json({ success: false, error: "username must be a string" });
    }
    if (updates.fname !== undefined && typeof updates.fname !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "fname must be a string" });
    }
    if (updates.lname !== undefined && typeof updates.lname !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "lname must be a string" });
    }
    if (updates.email !== undefined && typeof updates.email !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "email must be a string" });
    }

    // const updatedUser = {
    //   id: userId,
    //   username: "placeholder_username",
    //   fname: "First",
    //   lname: "Last",
    //   email: "user@example.com",
    //   created_at: new Date().toISOString(),
    //   balance: 0,
    //   times_banned: 0,
    // };

    // TODO: Replace with DB update
    // TODO: const updatedUser = ...;

    return res.json({
      success: true,
      message: "Profile updated",
      data: updatedUser,
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
