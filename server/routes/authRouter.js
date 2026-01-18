const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  res.set('IdP-Response', 'true');
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
      clockTolerance: 10,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    // TODO: save or update user in DB here
    const sessionToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("session", sessionToken, {
      httpOnly: true,
      secure: false, // true in prod (https)
      sameSite: "lax",
    });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Authentication failed" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.json({ message: "Logged out" });
});

router.get("/me", (req, res) => {
  const token = req.cookies.session; // Matches the name in res.cookie("session", ...)

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Return the user data stored in the JWT
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ authenticated: false, message: "Invalid session" });
  }
});

module.exports = router;
