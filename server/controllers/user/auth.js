import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

dotenv.config();

export const router = express.Router();

const defaultTokenLifeTime = 60 * 60; // 1 hour

const {
  JWT_TOKEN_LIFETIME: tokenLifetime = defaultTokenLifeTime,
} = process.env;

router.get("/api/auth", (req,res)=>{
  res.redirect(`${process.env.REACT_APP_API_URL}/oauth/authorize?client_id=${process.env.client_id}
  &redirect_uri=http://localhost:5000/api/auth/callback
  &response_type=code
  &scope=full_name+email+vatsim_details+country`);
});

router.get("/api/auth/callback",async (req, res) => {
  const body ={
    grant_type:'authorization_code',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    redirect_uri: 'http://localhost:5000/api/auth/callback',
    code: req.query.code,
  }
  const result = await fetch(`${process.env.REACT_APP_API_URL}/oauth/token`, {
    body:    JSON.stringify(body),
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  });
  const r = await result.json();
  const data = await fetch(`${process.env.REACT_APP_API_URL}/api/user`,{
    headers:{
      'Accept' : 'application/json',
      'Authorization' : `Bearer ${r.access_token}`,
    }
  });
  const d = await data.json();
  if(d.data.oauth.token_valid == 'true'){
    const payload = { email: d.data.personal.email };
    const tokenOptions = { expiresIn: parseInt(tokenLifetime, 10) };
    const token = jwt.sign(payload, r.access_token, tokenOptions);
    res.cookie('token', token, { httpOnly: true });
    return res.json({ token });
  }
});

export function requireAuthentication(req, res, next) {
  const tutu = res.json();
  const token = tutu.req.rawHeaders[1].slice(tutu.req.rawHeaders[1].indexOf('token')+6, tutu.req.rawHeaders[1].length)
   if (token == null) return res.sendStatus(401)
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
  

  
}
