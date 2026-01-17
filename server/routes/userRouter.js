const { Router } = require("express");
const userRouter = new Router();
const userController = require("../controllers/userController");

userRouter.post('/:userId/newcontract', userController.createContract);

module.exports = userRouter;
