import { Router } from 'express';
import { signPayload } from '../core/wallet';
import { validator } from '../core/validator';
import { chain } from '../core/chain';
import { Transaction } from '../core/tx';

const router = Router();

// Platzhalter: In-Memory-Balances
const balances: Record<string, Record<string, string>> = {};
const users: any[] = []; // hier müsstest du denselben Store wie in auth.ts teilen

function getBalance(address: string, token: string): string {
  return balances[address]?.[token] ?? '0';
}

router.get('/balance/:address/:token', (req, res) => {
  const { address, token } = req.params;
  res.json({ address, token, balance: getBalance(address, token) });
});

router.post('/send', (req, res) => {
  const { from, to, amount, token, phrase, userId, username } = req.body;

  const payload = JSON.stringify({ from, to, amount, token, ts: Date.now() });
  const signature = signPayload(phrase, payload);

  const tx: Transaction = {
    id: signature.slice(0, 32),
    from,
    to,
    amount,
    token,
    type: 'TRANSFER',
    timestamp: Date.now(),
    signature,
  };

  const block = validator.commitBlock([tx], from);

  validator.recordInteraction({
    userId,
    username,
    walletAddress: from,
    type: 'TRANSFER',
    payload: { to, amount, token, blockHash: block.hash },
    timestamp: Date.now(),
  });

  res.json({ tx, blockHash: block.hash });
});

export default router;
