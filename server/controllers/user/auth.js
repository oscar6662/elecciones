import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import { query } from '../db/db.js';

dotenv.config();

export const router = express.Router();

router.use(cookieParser());

router.get('/api/auth', (req, res) => {
  res.redirect(`${process.env.REACT_APP_API_URL}/oauth/authorize?client_id=${process.env.client_id}
  &redirect_uri=http://localhost:5000/api/auth/callback
  &response_type=code
  &scope=full_name+email+vatsim_details`);
});

router.get('/api/auth/callback', async (req, res) => {
  const body = {
    grant_type: 'authorization_code',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    redirect_uri: 'http://localhost:5000/api/auth/callback',
    code: req.query.code,
  };

  const result = await fetch(`${process.env.REACT_APP_API_URL}/oauth/token`, {
    body: JSON.stringify(body),
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });

  const r = await result.json();
  const data = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${r.access_token}`,
    },
  });

  const d = await data.json();
  if (d.data.oauth.token_valid === 'true') {
    const payload = { email: d.data.personal.email };
    const tokenOptions = { expiresIn: r.expires_in };
    const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
    const expiry = new Date(Date.now() + r.expires_in * 1000);
    const q = 'INSERT INTO token (jwt, access, refresh, date) VALUES ($1, $2, $3, $4)';

    await query(q, [token, r.access_token, r.refresh_token, expiry]);

    res.cookie('token', token, {
      expires: new Date(Date.now() + r.expires_in * 1000),
      httpOnly: true,
    });

    return res.redirect('http://localhost:3000/');
  }
  return res.sendStatus(403);
});

export async function requireAuthentication(req, res, next) {
  const { token } = req.cookies;
  if (token == null) return res.sendStatus(401);
  const verify = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return false;
    req.user = user;
    return true;
  });

  if (verify === false) return res.status(401).json({ error: 'token verification failed' });

  const q = 'SELECT date FROM token WHERE jwt = ($1)';
  try {
    const r = await query(q, [token]);
    if (r.rows.length < 0) return res.status(401).json({ error: 'No token found' });
    if (r.rows[0].date < new Date(Date.now())) {
      return res.status(401).json({ error: 'token expired' });
    }
    return next();
  } catch (e) {
    return res.status(401).json({ error: e });
  }
}

export async function isAuthenticated(req) {
  const { token } = req.cookies;
  if (token == null) return false;
  const verify = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return false;
    req.user = user;
    return true;
  });

  if (verify === false) return false;

  const q = 'SELECT date FROM token WHERE jwt = ($1)';
  try {
    const r = await query(q, [token]);
    if (r.rows.length < 0) return false;
    if (r.rows[0].date < new Date(Date.now())) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

router.get('/api/logout', requireAuthentication, async (req, res) => {
  const { token } = req.cookies;
  res.cookie('token', token, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.redirect('/');
});
