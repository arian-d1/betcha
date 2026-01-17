// data/mock-data.ts
import type { Contract } from "@/types/Contract";
import type { User } from "@/types/User";

const userAlice: User = {
  id: "u-1",
  name: "Alice Crypto",
  created_at: "2023-10-01T12:00:00Z",
};

const userBob: User = {
  id: "u-2",
  name: "Bob Bets",
  created_at: "2023-11-15T09:30:00Z",
};

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "c-101",
    maker: userAlice,
    taker: null, // Available for anyone
    title: "Chess Match: $50 Stakes",
    description: "Blitz 5+0 on Lichess. Winner takes all. I'm rated 1800, looking for a challenge.",
    amount: 50.00,
    status: "open",
    created_at: "2024-03-24T10:00:00Z",
  },
  {
    id: "c-102",
    maker: userBob,
    taker: userAlice, // Already matched
    title: "Premier League: Arsenal vs City",
    description: "I have Arsenal to win. Alice took the draw/City side.",
    amount: 100.00,
    status: "active",
    created_at: "2024-03-23T08:00:00Z",
  }
];