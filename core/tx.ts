export type TxType = 'TRANSFER' | 'STAKE' | 'UNSTAKE' | 'LAUNCH_TOKEN' | 'TRADE';

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  type: TxType;
  timestamp: number;
  signature: string;
}
