import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { query } from '../db/db.js';
import { requireAuthentication } from './auth.js';
import { userId } from './users.js';

dotenv.config();

export const router = express.Router();

export async function validVoter(req) {
  const { token } = req.cookies;
  const q = 'SELECT access, has_voted FROM users WHERE jwt = $1 ';
  try {
    const r = await query(q, [token]);
    const data = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${r.rows[0].access}`,
      },
    });
    const j = await data.json();
    return (
      (j.data.vatsim.subdivision.id === 'SPN'
      && j.data.vatsim.rating.id >= 0
      && !r.rows[0].has_voted)
    );
  } catch (e) {
    return false;
  }
}

router.get('/api/validvoter', requireAuthentication, async (req, res) => {
  res.json(await validVoter(req));
});

router.post('/api/vote', requireAuthentication, validVoter, async (req, res) => {
  const { token } = req.cookies;
  const userid = await userId(token);
  const { id } = req.body;
  const q = 'UPDATE candidates SET votes = votes + 1 WHERE id = $1';
  const q2 = 'UPDATE users SET has_voted = true WHERE id = $1';
  try {
    await query(q, [id]);
    await query(q2, [userid]);
    return res.json('success');
  } catch (error) {
    return res.json({ error });
  }
});
