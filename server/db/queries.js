require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = "main";
const usersCollectionName = "users";
const contractsCollectionName = "contracts";

// Get users collection
async function getUsersCollection() {
  if (!client.isConnected?.()) {
    await client.connect();
  }
  return client.db(dbName).collection(usersCollectionName);
}

// CREATE — Insert a new user
async function createUser(user) {
  const users = await getUsersCollection();
  return users.insertOne({
    uuid: user.uuid,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    balance: Number(user.balance),
    accountCreatedAt: user.accountCreatedAt ?? new Date(),
    exp: user.exp,
    level: user.level,
    timesBanned: user.timesBanned
  });
}

// READ — Get a user by UUID
async function getUser(uuid) {
  const users = await getUsersCollection();
  return users.findOne({ uuid });
}

// UPDATE — Update a user by UUID
async function updateUser(uuid, updates) {
  const users = await getUsersCollection();
  return users.updateOne({ uuid }, { $set: updates });
}

// DELETE — Delete a user by UUID
async function deleteUser(uuid) {
  const users = await getUsersCollection();
  return users.deleteOne({ uuid });
}

// Get contracts collection
async function getContractsCollection() {
    if (!client.isConnected?.()) {
      await client.connect();
    }
    return client.db(dbName).collection(contractsCollectionName);
}

// CREATE — Insert a new contract
async function createContract(contract) {
    const contracts = await getContractsCollection();
    return contracts.insertOne({
        id: contract.id,
        maker: contract.maker,
        taker: contract.taker,
        title: contract.title,
        description: contract.description,
        amount: contract.amount,
        status: contract.status ?? "open",
        winner: contract.winner,
        created_at: contract.created_at ?? new Date()
    });
  }
  
  // READ — Get a user by UUID
  async function getContract(id) {
    const contracts = await getContractsCollection();
    return contracts.findOne({ id });
  }
  
  // UPDATE — Update a user by UUID
  async function updateContract(id, updates) {
    const contracts = await getContractsCollection();
    return contracts.updateOne({ id }, { $set: updates });
  }
  
  // DELETE — Delete a user by UUID
  async function deleteContract(id) {
    const contracts = await getContractsCollection();
    return contracts.deleteOne({ id });
  }

module.exports = { createUser, getUser, updateUser, deleteUser, createContract, getContract, updateContract, deleteContract};
