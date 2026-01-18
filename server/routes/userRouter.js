const { Router } = require("express");
const userRouter = new Router();
const userController = require("../controllers/userController");

userRouter.get("/by-email", userController.getUserByEmail);

userRouter.post("/:userId/newcontract", userController.createContract);

// View profile
userRouter.get("/:userId", userController.getUserProfile);

// Edit profile (partial updates)
userRouter.patch("/:userId", userController.updateUsername);

module.exports = userRouter;
