import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';

import fetch from 'node-fetch';
dotenv.config();
let user = {};

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

const app = express();
app.use(cors());
app.use(passport.initialize());

app.get("/",(req,res)=>{
  if(2==3){
    res.redirect('/hola')
  }
  res.redirect('/hola');
});

app.get("/auth", (req,res)=>{
  res.redirect(`${process.env.REACT_APP_API_URL}/oauth/authorize?client_id=${process.env.client_id}
  &redirect_uri=http://localhost:5000/auth/callback
  &response_type=code
  &scope=full_name`);
});


app.get("/auth/callback",(req, res) => {
  const body ={
    grant_type:'authorization_code',
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    redirect_uri: 'http://localhost:5000/auth/callback',
    code: req.query.code,
  }
  fetch(`${process.env.REACT_APP_API_URL}/oauth/token`, {
    body:    JSON.stringify(body),
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.json())
  .then(json => console.log(json))
  .then(res.redirect('hola'));
});

if (process.env.NODE_ENV === "development") {
  console.log(process.env.NODE_ENV);
    app.listen(5000);
}



/**
 * Middleware sem sér um 404 villur.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 */
// eslint-disable-next-line no-unused-vars
function notFoundHandler(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

/**
 * Middleware sem sér um villumeðhöndlun.
 *
 * @param {object} err Villa sem kom upp
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}
app.use(notFoundHandler);
app.use(errorHandler);

