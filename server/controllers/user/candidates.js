import express from 'express';
import dotenv from 'dotenv';
import { query } from '../db/db.js';
import { requireAuthentication } from './auth.js';
import { userData } from './users.js';

dotenv.config();

export const router = express.Router();

router.post('/api/candidate', requireAuthentication, async (req, res) => {
  console.log(req.body);
  const {
    name, id, email, propuestas,
  } = req.body;
  const q = 'INSERT INTO candidates (name, id, email, txt) VALUES ($1, $2, $3, $4)';

  try {
    await query(q, [name, id, email, propuestas]);
  } catch (e) {
    res.json({ error: e });
  }
});

router.get('/api/candidates', async (req, res) => {
  const q = 'SELECT * FROM candidates';

  try {
    const data = await query(q);
    res.json(data.rows);
  } catch (e) {
    res.json({ error: e });
  }
});

router.get('/api/candidate/requisites', requireAuthentication, async (req, res) => {
  const data = await userData(req.cookies.token);
  const response = { division: '', rating: '' };
  if (data.data.vatsim.subdivision.id !== 'SPN') {
    response.division = 'error';
  } else if (data.data.vatsim.rating < 4) {
    response.rating = 'error';
  }
  if (response.division !== 'error' && response.rating !== 'error') {
    res.json({ response: true });
  } else {
    res.json({ response });
  }
});
