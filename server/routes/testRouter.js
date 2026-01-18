const { Router } = require("express");
const testRouter = new Router();
const testController = require("../controllers/testController");

testRouter.get("/", testController.testFunction);

module.exports = testRouter;
