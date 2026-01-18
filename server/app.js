const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

const express = require("express");
const session = require("express-session");
const cors = require("cors");

const contractRouter = require("./routes/contractRouter.js");
const userRouter = require("./routes/userRouter.js");
const testRouter = require("./routes/testRouter.js");

const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow cookies
  }),
);

app.set("trust proxy", 1); // Set to 1 for single proxy, or true for multiple

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/contracts", contractRouter);
app.use("/user", userRouter);
app.use("/", testRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
