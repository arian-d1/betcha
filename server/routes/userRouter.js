const { Router } = require("express");
const userRouter = new Router();
const userController = require("../controllers/userController");

userRouter.get("/by-email", userController.getUserByEmail);

userRouter.post("/:userId/newcontract", userController.createContract);

// View profile
userRouter.get("/:userId", userController.getUserProfile);
userRouter.get("/by-email", userController.getUserByEmail);

// Edit profile (partial updates)
userRouter.patch("/:userId", userController.updateUserProfile);

module.exports = userRouter;
