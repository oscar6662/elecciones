import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';
import passport from 'passport';
import chalk from 'chalk';
import GoogleStrategy from 'passport-google-oauth20';
import Strategy from 'passport-http-bearer';
dotenv.config();
let user = {};

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

// Google Strategy
passport.use(new GoogleStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log(chalk.blue(JSON.stringify(profile)));
        user = { ...profile };
        return cb(null, profile);
}));


passport.use("v", new Strategy({
  authorizationURL: 'http://auth-dev.vatsim.net',
  client_id: process.env.clientID,
  redirect_uri: "/auth/callback",
  response_type: 'code',
  scope:"full_name vatsim_details email country",
},
function(accessToken, refreshToken, profile, cb) {
  console.log("j");
  User.findOrCreate({ exampleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

const app = express();
app.use(cors());

app.use(passport.initialize());

app.get("/",(req,res)=>{
  if(2==3){
    res.redirect('/hola')
  }
  res.redirect('/hola');
})

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));
app.get("/auth/google/callback",
  passport.authenticate("google"),
      (req, res) => {
          res.redirect("/profile");
      });

app.get("/auth", passport.authenticate("v", {
  scope: ["profile", "email"]
}));
app.get("/auth/google/callback",
  passport.authenticate("google"),
      (req, res) => {
          res.redirect("/profile");
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
  console.log("hæ");
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

