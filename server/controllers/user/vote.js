import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { query } from '../db/db.js';
import { requireAuthentication } from './auth.js';
import { userId } from './users.js';

dotenv.config();

export const router = express.Router();

export async function validVoter(req, res, next) {
  try {
    const { token } = req.cookies;
    const q = 'SELECT access, has_voted FROM users WHERE jwt = $1 ';
    const r = await query(q, [token]);
    const data = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${r.rows[0].access}`,
      },
    });
    const j = await data.json();
    if (
      (j.data.vatsim.subdivision.id === 'SPN'
      && j.data.vatsim.rating.id >= 0
      && !r.rows[0].has_voted)
    ) {
      return next();
    }
  } catch (e) {
    return res.json(e);
  }
  return res.json({ error: 'an error occurred' });
}

// eslint-disable-next-line arrow-body-style
router.get('/api/validvoter', requireAuthentication, validVoter, (req, res) => res.json(true));

router.post('/api/vote', requireAuthentication, validVoter, async (req, res) => {
  const { token } = req.cookies;
  const userid = await userId(token);
  console.log(req.body);
  const { id } = req.body;
  console.log(id);
  const q = 'UPDATE candidates SET votes = votes + 1 WHERE id = $1';
  const q2 = 'UPDATE users SET has_voted = true WHERE id = $1';
  try {
    await query(q, [id]);
    await query(q2, [userid]);
    console.log("succ");
    return res.json('success');
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
});
