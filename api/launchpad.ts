// api/launchpad.ts
import { Router } from 'express';
const router = Router();

const tokens: any[] = [];

router.post('/create-token', (req, res) => {
  const { name, symbol, supply, owner } = req.body;
  const token = { id: tokens.length + 1, name, symbol, supply, owner };
  tokens.push(token);
  res.json({ token });
});

router.get('/list', (req, res) => {
  res.json({ tokens });
});

export default router;
