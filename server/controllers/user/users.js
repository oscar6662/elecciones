import dotenv from 'dotenv';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { query } from '../db/db.js';

dotenv.config();

export async function userData(token) {
  const q = 'SELECT access FROM users WHERE jwt = $1 ';
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

export async function userIsAdmin(token) {
  const q = 'SELECT admin FROM users WHERE jwt = $1 ';
  try {
    const r = await query(q, [token]);
    return await r.rows[0].admin;
  } catch (e) {
    return { error: e };
  }
}

export async function userExists(id) {
  const q = 'SELECT COUNT(1) FROM users WHERE id = $1';
  try {
    const r = await query(q, [id]);
    if (r.rows[0].count === '1') return true;
    return false;
  } catch (error) {
    return false;
  }
}

export async function createUser(data, r) {
  const payload = { email: data.cid };
  const tokenOptions = { expiresIn: r.expires_in };
  const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
  const expiry = new Date(Date.now() + r.expires_in * 1000);
  const q = 'INSERT INTO users'
    + '(id, user_name, user_email, has_voted, admin, jwt, access, refresh, date)'
    + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  try {
    await query(q,
      [data.cid, data.personal.name_full,
        data.personal.email, false, false,
        token, r.access_token, r.refresh_token, expiry,
      ]);
  } catch (error) {
    return error;
  }
  return token;
}

export async function makeToken(data, r) {
  const payload = { email: data.cid };
  const tokenOptions = { expiresIn: r.expires_in };
  const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
  const expiry = new Date(Date.now() + r.expires_in * 1000);
  // eslint-disable-next-line max-len
  const q = `UPDATE users SET jwt = $1, access = $2, refresh = $3, date = $4 WHERE id = ${data.cid}`;
  try {
    await query(q, [token, r.access_token, r.refresh_token, expiry]);
  } catch (error) {
    console.log(error);
    return false;
  }
  return token;
}
