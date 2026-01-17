const { Router } = require("express");
const testController = require("../controllers/testController");
const testRouter = new Router();

testRouter.get("/", testController.testFunction);

module.exports = testRouter;
