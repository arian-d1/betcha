const express = require("express");
const session = require("express-session");
const cors = require("cors");

const testRouter = require("./routes/testRouter.js");
const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow cookies
  }),
);

app.set("trust proxy", 1); // Set to 1 for single proxy, or true for multiple

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/test", testRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
