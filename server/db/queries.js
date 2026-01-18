require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = "main";
const usersCollectionName = "users";
const contractsCollectionName = "contracts";
const notificationsCollectionName = "notifications";

// Get users collection
async function getUsersCollection() {
  if (!client.isConnected?.()) {
    await client.connect();
  }
  return client.db(dbName).collection(usersCollectionName);
}

// Get notifications collection
async function getNotificationsCollection() {
  if (!client.isConnected?.()) {
    await client.connect();
  }
  return client.db(dbName).collection(notificationsCollectionName);
}

// CREATE — Insert a new user
async function createUser(user) {
  const users = await getUsersCollection();
  return users.insertOne({
    uuid: user.uuid,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    balance: Number(user.balance),
    accountCreatedAt: user.accountCreatedAt ?? new Date(),
    exp: user.exp,
    level: user.level,
    timesBanned: user.timesBanned,
  });
}

// READ — Get a user by UUID
async function getUser(uuid) {
  const users = await getUsersCollection();
  return users.findOne({ uuid });
}

async function getUserByEmail(email) {
  const users = await getUsersCollection();
  return users.findOne({ email });
}

// Optional (only if you actually store username in users)
async function getUserByUsername(username) {
  const users = await getUsersCollection();
  return users.findOne({ username });
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
    created_at: contract.created_at ?? new Date(),
    makerClaim: contract.makerClaim,
    takerClaim: contract.takerClaim,
  });
}

async function listPublicContracts({ page = 1, limit = 20, search, username }) {
  const contracts = await getContractsCollection();
  const query = {};
  query.status = { $in: ["open", "active", "resolved", "cancelled"] }

  if (username) {
    const u = await getUserByUsername(username);
    if (!u?.uuid) return { data: [], total: 0 };
    query.maker = u.uuid;
  }

  if (search) {
    const or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
    const asNum = Number(search);
    if (!Number.isNaN(asNum)) or.push({ amount: asNum });
    query.$or = or;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    contracts
      .find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    contracts.countDocuments(query),
  ]);

  return { data, total };
}

// READ — Get a user by UUID
async function getContract(id) {
  const contracts = await getContractsCollection();
  return contracts.findOne({ id });
}

async function getContractsByUser(userId) {
  const contracts = await getContractsCollection();
  return contracts
    .find({ $or: [{ maker: userId }, { taker: userId }] })
    .sort({ created_at: -1 })
    .toArray();
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

async function claimContract(id, claimingUserId) {
  const contracts = await getContractsCollection();

  // Only claim if open AND unclaimed
  return contracts.findOneAndUpdate(
    {
      id,
      status: "open",
      $or: [{ taker: null }, { taker: { $exists: false } }],
    },
    { $set: { taker: claimingUserId, status: "active" } },
    { returnDocument: "after" },
  );
}

// CREATE — Insert a new notification
async function createNotification(notification) {
  const notifications = await getNotificationsCollection();
  return notifications.insertOne({
    n_id: notification.n_id,
    from_uid: notification.from_uid,
    to_uid: notification.to_uid,
    contract_id: notification.contract_id,
    amount: Number(notification.amount),
    status: notification.status ?? "pending",
    created_at: notification.created_at ?? new Date(),
  });
}

// READ — List notifications (optionally filtered)
async function listNotifications({ to_uid, from_uid, contract_id, status, limit = 50 } = {}) {
  const notifications = await getNotificationsCollection();

  const query = {};
  if (to_uid) query.to_uid = to_uid;
  if (from_uid) query.from_uid = from_uid;
  if (contract_id) query.contract_id = contract_id;
  if (status) query.status = status;

  const lim = Math.max(1, Math.min(Number(limit) || 50, 200));

  const data = await notifications
    .find(query)
    .sort({ created_at: -1 })
    .limit(lim)
    .toArray();

  return data;
}

// READ — Get notification by n_id
async function getNotification(n_id) {
  const notifications = await getNotificationsCollection();
  return notifications.findOne({ n_id });
}

// PATCH — Update status by notification id
async function updateNotificationStatus(n_id, status) {
  const notifications = await getNotificationsCollection();
  return notifications.findOneAndUpdate(
    { n_id },
    { $set: { status, updated_at: new Date() } },
    { returnDocument: "after" },
  );
}

module.exports = {
  createUser,
  getUser,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
  createContract,
  listPublicContracts,
  getContract,
  getContractsByUser,
  updateContract,
  deleteContract,
  claimContract,
  createNotification,
  listNotifications,
  getNotification, 
  updateNotificationStatus,
};
