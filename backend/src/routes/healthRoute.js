import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ message: 'Health Okay!!!' });
});

export default router;
