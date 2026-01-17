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
  created_at: string;
}
