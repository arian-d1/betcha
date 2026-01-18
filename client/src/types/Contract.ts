  import type { User } from "./User.ts";
import type { ContractStatus } from "./ContractStatus.ts";

export interface Contract {
  id: string;
  maker: User;
  taker: User | null;
  title: string;
  description: string;
  amount: number;
  status: ContractStatus;
  winner: string;
  created_at: string;
  // True => I win
  // False => I lose
  maker_claim: boolean | null;
  taker_claim: boolean | null;
}
