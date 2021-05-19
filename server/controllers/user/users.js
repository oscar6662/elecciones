import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { query } from '../db/db.js';

dotenv.config();

export async function userData(token) {
  const q = 'SELECT access FROM token WHERE jwt = $1 ';
  try {
    const r = await query(q, [token]);
    const data = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${r.rows[0].access}`,
      },
    });
    return await data.json();
  } catch (e) {
    return { error: e };
  }
}
