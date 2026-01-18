const { Router } = require("express");
const contractRouter = new Router();
const contractController = require("../controllers/contractController");

// GET /contracts - List public contracts with pagination/search
contractRouter.get("/", contractController.getPublicContracts);

// GET /contracts/user/:userId - Contracts for a specific user
contractRouter.get("/user/:userId", contractController.getContractsByUser);

// GET /contracts/:contractId - Specific contract info
contractRouter.get("/:contractId", contractController.getContractById);

// PATCH /contracts/:contractId/claim - Claim a contract
contractRouter.patch("/:contractId/claim", contractController.claimContract);

module.exports = contractRouter;
