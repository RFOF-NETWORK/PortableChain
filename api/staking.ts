// api/staking.ts
import { Router } from 'express';
const router = Router();

const pools: any[] = [];
const stakes: any[] = [];

router.get('/pools', (req, res) => {
  res.json({ pools });
});

router.post('/stake', (req, res) => {
  const { userId, poolId, amount } = req.body;
  const stake = { id: stakes.length + 1, userId, poolId, amount };
  stakes.push(stake);
  res.json({ stake });
});

router.post('/unstake', (req, res) => {
  const { stakeId } = req.body;
  res.json({ unstaked: stakeId });
});

export default router;
