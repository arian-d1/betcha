const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const contractRouter = require("./routes/contractRouter.js");
const userRouter = require("./routes/userRouter.js");
const testRouter = require("./routes/testRouter.js");
const authRouter = require("./routes/authRouter");
const notificationRouter = require("./routes/notificationRouter");

const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // allow cookies
  }),
);
// app.use(session({
//   secret: process.env.SESSION_SECRET, // Ensure this is in your .env
//   resave: false,
//   saveUninitialized: false,
//   proxy: true, // Required if you use 'trust proxy'
//   cookie: {
//     // 1. Must be false for http://localhost (unless using https)
//     secure: process.env.NODE_ENV === "production", 
    
//     // 2. httpOnly should ALWAYS be true for security
//     httpOnly: true, 
    
//     // 3. 'lax' is best for local dev; 'none' REQUIRES 'secure: true'
//     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   }
// }));

app.set("trust proxy", 1); // Set to 1 for single proxy, or true for multiple

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/contracts", contractRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/notification", notificationRouter);
app.use("/", testRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
