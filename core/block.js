import crypto from 'crypto';
import { Transaction } from './tx';

export interface BlockProps {
  index: number;
  previousHash: string;
  timestamp: number;
  transactions: Transaction[];
  validator: string;
}

export class Block {
  index: number;
  previousHash: string;
  timestamp: number;
  transactions: Transaction[];
  validator: string;
  hash: string;

  constructor(props: BlockProps) {
    this.index = props.index;
    this.previousHash = props.previousHash;
    this.timestamp = props.timestamp;
    this.transactions = props.transactions;
    this.validator = props.validator;
    this.hash = this.computeHash();
  }

  computeHash(): string {
    const data =
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.validator;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
