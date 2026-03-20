import { Router } from 'express';
import crypto from 'crypto';
import { generateMnemonic, walletFromMnemonic } from '../core/wallet';
import { validator } from '../core/validator';

const router = Router();

// In-Memory-Store als Platzhalter
const users: any[] = [];

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: 'USERNAME_EXISTS' });
  }

  const mnemonic = generateMnemonic();
  const wallet = walletFromMnemonic(mnemonic);
  const passwordHash = hashPassword(password);

  const user = {
    id: String(users.length + 1),
    username,
    passwordHash,
    mnemonic, // für echte Nutzung: verschlüsseln!
    walletAddress: wallet.address,
  };
  users.push(user);

  validator.registerUser({
    userId: user.id,
    username: user.username,
    walletAddress: user.walletAddress,
  });

  res.json({
    userId: user.id,
    username: user.username,
    walletAddress: user.walletAddress,
    phrase: mnemonic,
  });
});

router.post('/login', (req, res) => {
  const { username, password, phrase } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ error: 'INVALID_CREDENTIALS' });

  if (user.passwordHash !== hashPassword(password))
    return res.status(400).json({ error: 'INVALID_CREDENTIALS' });

  if (user.mnemonic !== phrase)
    return res.status(400).json({ error: 'INVALID_CREDENTIALS' });

  res.json({
    userId: user.id,
    username: user.username,
    walletAddress: user.walletAddress,
  });
});

export default router;
