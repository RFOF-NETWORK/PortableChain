import { Block } from './block';
import { Transaction } from './tx';

export class Chain {
  private blocks: Block[] = [];

  constructor() {
    const genesis = new Block({
      index: 0,
      previousHash: '0',
      timestamp: Date.now(),
      transactions: [],
      validator: 'GENESIS',
    });
    this.blocks.push(genesis);
  }

  getLatestBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  addBlock(transactions: Transaction[], validator: string): Block {
    const latest = this.getLatestBlock();
    const block = new Block({
      index: latest.index + 1,
      previousHash: latest.hash,
      timestamp: Date.now(),
      transactions,
      validator,
    });
    this.blocks.push(block);
    return block;
  }

  getBlocks(): Block[] {
    return this.blocks.slice().reverse();
  }

  findBlockByHash(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash);
  }

  searchByAddressOrToken(query: string): { blocks: Block[] } {
    const q = query.toLowerCase();
    const blocks = this.blocks.filter((b) =>
      b.transactions.some(
        (tx) =>
          tx.from.toLowerCase().includes(q) ||
          tx.to.toLowerCase().includes(q) ||
          tx.token.toLowerCase().includes(q),
      ),
    );
    return { blocks };
  }
}

export const chain = new Chain();
