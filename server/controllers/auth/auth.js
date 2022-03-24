import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import {
  Strategy as OAuth2Strategy,
} from 'passport-oauth2';

import {
  findById,
  createUser,
  updateAccess,
} from '../user/users.js';

dotenv.config();

const {
  authorizationURL,
  tokenURL,
  clientID,
  callbackURL,
  clientSecret,
  userURL,
} = process.env;

export const router = express.Router();

router.use(session({
  secret: '489vlkS4jvhpakjv.,mnzjhDF4i1!',
  resave: false,
  saveUninitialized: false,
}));

passport.use(new OAuth2Strategy({
  authorizationURL,
  tokenURL,
  clientID,
  clientSecret,
  callbackURL,
  scope: 'full_name email vatsim_details',
},
async (accessToken, refreshToken, profile, done) => {
  let user = await findById(profile.cid);
  if (user) {
    return done(null, user);
  }
  let reqst = '';
  try {
    reqst = await fetch(userURL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
  const { data } = await reqst.json();
  user = await findById(data.cid);
  if (user) {
    await updateAccess(user.id, accessToken);
    return done(null, user);
  }
  user = await createUser(data, accessToken);
  return done(null, user);
},
true));

router.use(cookieParser());
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

router.get('/api/auth', passport.authenticate('oauth2', {
  failureMessage: 'Notandanafn eða lykilorð vitlaust.',
  failureRedirect: '/api/auth',
}));

export function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/api/auth');
}

router.get(
  '/api/auth/callback',
  passport.authenticate('oauth2', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/api/auth',
  }),
  (req, res) => {
    res.redirect('/profile');
  },
);

router.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
