// data/mock-contracts.ts
import type { Contract } from "@/types/Contract";
import type { User } from "@/types/User";

const EMAIL = "user@example.com";

const users: Record<string, User> = {
  alice: {
    id: "u-1",
    username: "test1",
    fname: "Alice",
    lname: "Crypto",
    email: EMAIL,
    balance: 1250.5,
    times_banned: 0,
    created_at: "2023-10-01T",
  },
  bob: {
    id: "u-2",
    username: "test2",
    fname: "Bob",
    lname: "Bets",
    email: EMAIL,
    balance: 420.0,
    times_banned: 1,
    created_at: "2023-11-15T",
  },
  charlie: {
    id: "u-3",
    username: "test3",
    fname: "Charlie",
    lname: "Gaming",
    email: EMAIL,
    balance: 85.25,
    times_banned: 0,
    created_at: "2024-01-05T",
  },
  dana: {
    id: "u-4",
    username: "test4",
    fname: "Dana",
    lname: "Degen",
    email: EMAIL,
    balance: 3100.0,
    times_banned: 3,
    created_at: "2024-02-10T",
  },
};
export const MOCK_CONTRACTS: Contract[] = [
  // --- OPEN & ACTIVE (No winners yet) ---
  {
    id: "c-101",
    maker: users.alice,
    taker: null,
    title: "Chess Match: $50 Stakes",
    description: "Blitz 5+0 on Lichess. Winner takes all.",
    amount: 50.0,
    status: "open",
    created_at: "2024-03-24T10:00:00Z",
    winner: "",
  },
  {
    id: "c-201",
    maker: users.bob,
    taker: users.alice,
    title: "Premier League: Arsenal vs City",
    description: "I have Arsenal to win. Alice took the draw/City side.",
    amount: 100.0,
    status: "active",
    created_at: "2024-03-23T08:00:00Z",
    winner: "",
  },

  // --- RESOLVED CONTRACTS (With winners) ---
  {
    id: "c-301",
    maker: users.alice,
    taker: users.bob,
    title: "Weekly Steps Challenge",
    description: "Who walks more steps? Proof via HealthApp.",
    amount: 20.0,
    status: "resolved",
    winner: "u-1", // Alice won
    created_at: "2024-03-18T07:00:00Z",
  },
  {
    id: "c-302",
    maker: users.charlie,
    taker: users.dana,
    title: "UFC 299: O'Malley vs Vera",
    description: "Charlie took O'Malley. Dana took Vera.",
    amount: 75.0,
    status: "resolved",
    winner: "u-4", // Dana won
    created_at: "2024-03-10T22:00:00Z",
  },

  // --- CANCELLED ---
  {
    id: "c-401",
    maker: users.bob,
    taker: null,
    title: "NBA: Lakers vs Warriors",
    description: "LeBron is out tonight, so I'm cancelling.",
    amount: 40.0,
    status: "cancelled",
    winner: "",
    created_at: "2024-03-22T18:00:00Z",
  },
];
