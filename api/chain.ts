import { Router } from 'express';
import { chain } from '../core/chain';

const router = Router();

router.get('/blocks', (req, res) => {
  res.json({ blocks: chain.getBlocks() });
});

router.get('/block/:hash', (req, res) => {
  const block = chain.findBlockByHash(req.params.hash);
  if (!block) return res.status(404).json({ error: 'NOT_FOUND' });
  res.json({ block });
});

router.get('/search', (req, res) => {
  const q = String(req.query.q || '');
  const result = chain.searchByAddressOrToken(q);
  res.json(result);
});

export default router;
