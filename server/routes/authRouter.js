const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const db = require("../db/queries");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function splitName(payload) {
  // Prefer Google's structured fields when available
  const first = payload.given_name || (payload.name ? payload.name.split(" ")[0] : null);
  const last =
    payload.family_name ||
    (payload.name ? payload.name.split(" ").slice(1).join(" ") : null) ||
    null;
  return { firstName: first, lastName: last };
}

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

    let dbUser = await db.getUserByEmail(payload.email);

    if (!dbUser) {
      const { firstName, lastName } = splitName(payload);

      const newUser = {
        uuid: payload.sub, // use Google sub as stable unique id
        firstName,
        lastName,
        username: "",
        email: payload.email,
        balance: 0,
        accountCreatedAt: new Date(),
        exp: 0,
        level: 1,
        timesBanned: 0,
      };

      await db.createUser(newUser);
      dbUser = await db.getUser(payload.sub);
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

    res.json({ user: dbUser });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Authentication failed" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.json({ message: "Logged out" });
});

router.get("/me", async (req, res) => {
  const token = req.cookies.session; // Matches the name in res.cookie("session", ...)

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.getUserByEmail(decoded.email)
    res.json({ authenticated: true, user });
  } catch (err) {
    res.status(401).json({ authenticated: false, message: "Invalid session" });
  }
});

module.exports = router;
