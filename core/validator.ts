import { EventEmitter } from 'events';
import { Transaction } from './tx';
import { chain } from './chain';

export interface UserValidator {
  userId: string;
  username: string;
  walletAddress: string;
}

export interface InteractionEvent {
  userId: string;
  username: string;
  walletAddress: string;
  type: string;
  payload: any;
  timestamp: number;
}

export class Validator extends EventEmitter {
  private extendedValidators = new Map<string, UserValidator>();

  registerUser(user: UserValidator) {
    this.extendedValidators.set(user.userId, user);
  }

  recordInteraction(event: InteractionEvent) {
    this.emit('interaction', event);
  }

  commitBlock(transactions: Transaction[], validatorAddress: string) {
    return chain.addBlock(transactions, validatorAddress);
  }
}

export const validator = new Validator();
