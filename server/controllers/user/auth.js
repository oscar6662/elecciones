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
  &scope=email`);
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

    return res.json({ token });
  }
  return res.sendStatus(403);
});

export function requireAuthentication(req, res, next) {
  const { token } = req.cookies;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    return next();
  });
  return res.sendStatus(403);
}

export function isAuthenticated(req) {
  const { token } = req.cookies;
  if (token == null) return false;
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return false;
    req.user = user;
    return true;
  });
  return false;
}

router.get('/api/logout', requireAuthentication, async (req, res) => {

});