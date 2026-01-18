require('dotenv').config();
const { createUser, getUser, updateUser, deleteUser, createContract, getContract, updateContract, deleteContract} = require('./queries.js');

async function runTests() {
  
  // -------------------
  // USER TESTS
  // -------------------

  const testUuid = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXOOOO";

  console.log("=== CREATE USER ===");
  const createResult = await createUser({
    uuid: testUuid,
    firstName: "Jack",
    lastName: "Smith",
    email: "jack.smith@no.com",
    balance: 0,
    accountCreatedAt: new Date("1900-01-01T00:00:00Z")
  });
  console.log("Inserted:", createResult.insertedId);

  console.log("\n=== READ USER ===");
  const user = await getUser(testUuid);
  console.log("Found user:", user);

  console.log("\n=== UPDATE USER ===");
  const updateResult = await updateUser(testUuid, { balance: 1 });
  console.log("Modified count:", updateResult.modifiedCount);

  console.log("\n=== DELETE USER ===");
  const deleteResult = await deleteUser(testUuid);
  console.log("Deleted count:", deleteResult.deletedCount);

  
  // -------------------
  // CONTRACT TESTS
  // -------------------
  const testContractId = "TEST-CONTRACT-001";

  console.log("\n=== CREATE CONTRACT ===");
  const createContractResult = await createContract({
    id: testContractId,
    maker: testUuid,
    taker: null,
    title: "Test Contract",
    description: "This is a test contract",
    amount: 100,
    status: "open",
    winner: null,
    created_at: new Date()
  });
  console.log("Inserted:", createContractResult.insertedId);

  console.log("\n=== READ CONTRACT ===");
  const contract = await getContract(testContractId);
  console.log("Found contract:", contract);

  console.log("\n=== UPDATE CONTRACT ===");
  const updateContractResult = await updateContract(testContractId, { 
    status: "active", 
    taker: testUuid
  });
  console.log("Modified count:", updateContractResult.modifiedCount);

  console.log("\n=== DELETE CONTRACT ===");
  const deleteContractResult = await deleteContract(testContractId);
  console.log("Deleted count:", deleteContractResult.deletedCount);

  process.exit(0); // ensures Node exits after async operations
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
