// data/mock-contracts.ts
import type { Contract } from "@/types/Contract";
import type { User } from "@/types/User";

const EMAIL = "user@example.com";

const users: Record<string, User> = {
  alice: {
    id: "u-1",
    username: "crypto_queen",
    fname: "Alice",
    lname: "Crypto",
    email: EMAIL,
    balance: 1250.5,
    times_banned: 0,
    created_at: "2023-10-01T",
  },
  bob: {
    id: "u-2",
    username: "betting_bob",
    fname: "Bob",
    lname: "Bets",
    email: EMAIL,
    balance: 420.0,
    times_banned: 1,
    created_at: "2023-11-15T",
  },
  charlie: {
    id: "u-3",
    username: "charlie_pro",
    fname: "Charlie",
    lname: "Gaming",
    email: EMAIL,
    balance: 85.25,
    times_banned: 0,
    created_at: "2024-01-05T",
  },
  dana: {
    id: "u-4",
    username: "dana_degen",
    fname: "Dana",
    lname: "Degen",
    email: EMAIL,
    balance: 3100.0,
    times_banned: 3,
    created_at: "2024-02-10T",
  },
};
export const MOCK_CONTRACTS: Contract[] = [
  // --- OPEN CONTRACTS ---
  {
    id: "c-101",
    maker: users.alice,
    taker: null,
    title: "Chess Match: $50 Stakes",
    description:
      "Blitz 5+0 on Lichess. Winner takes all. I'm rated 1800, looking for a challenge.",
    amount: 50.0,
    status: "open",
    created_at: "2024-03-24T10:00:00Z",
  },
  {
    id: "c-103",
    maker: users.dana,
    taker: null,
    title: "F1: Verstappen to win Australian GP",
    description:
      "I'm betting Max wins the race. You take the field (anyone else wins).",
    amount: 500.0,
    status: "open",
    created_at: "2024-03-25T09:00:00Z",
  },
  {
    id: "c-104",
    maker: users.charlie,
    taker: null,
    title: "CS2 1v1 Aim Map",
    description: "Best of 30 rounds. AK-47 only. You host the server.",
    amount: 15.75,
    status: "open",
    created_at: "2024-03-25T15:30:00Z",
  },

  // --- ACTIVE CONTRACTS ---
  {
    id: "c-201",
    maker: users.bob,
    taker: users.alice,
    title: "Premier League: Arsenal vs City",
    description: "I have Arsenal to win. Alice took the draw/City side.",
    amount: 100.0,
    status: "active",
    created_at: "2024-03-23T08:00:00Z",
  },
  {
    id: "c-202",
    maker: users.dana,
    taker: users.charlie,
    title: "Solana hits $200 before Sunday",
    description: "Using Coinbase price. Dana says Yes, Charlie says No.",
    amount: 250.0,
    status: "active",
    created_at: "2024-03-24T11:00:00Z",
  },

  // --- RESOLVED CONTRACTS ---
  {
    id: "c-301",
    maker: users.alice,
    taker: users.bob,
    title: "Weekly Steps Challenge",
    description:
      "Who walks more steps between Monday and Wednesday? Proof via HealthApp.",
    amount: 20.0,
    status: "resolved",
    created_at: "2024-03-18T07:00:00Z",
  },
  {
    id: "c-302",
    maker: users.charlie,
    taker: users.dana,
    title: "UFC 299: O'Malley vs Vera",
    description:
      "Charlie took O'Malley. Dana took Vera. Resolved after the fight.",
    amount: 75.0,
    status: "resolved",
    created_at: "2024-03-10T22:00:00Z",
  },

  // --- CANCELLED CONTRACTS ---
  {
    id: "c-401",
    maker: users.bob,
    taker: null,
    title: "NBA: Lakers vs Warriors",
    description: "LeBron is out tonight, so I'm cancelling this wager.",
    amount: 40.0,
    status: "cancelled",
    created_at: "2024-03-22T18:00:00Z",
  },
];
