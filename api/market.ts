// api/market.ts
import { Router } from 'express';
const router = Router();

router.get('/ohlc', (req, res) => {
  const { pair } = req.query;
  // Platzhalter-Daten
  res.json({
    pair,
    candles: [
      { t: Date.now() - 600000, o: 1, h: 2, l: 0.5, c: 1.5 },
      { t: Date.now(), o: 1.5, h: 2.5, l: 1, c: 2 },
    ],
  });
});

export default router;
