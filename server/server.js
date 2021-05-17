import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import {
  router as authRouter,
  isAuthenticated,
  requireAuthentication,
} from './controllers/user/auth.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(authRouter);

app.get('/api/authenticated', (req, res) => {
  if (isAuthenticated) {
    res.json({ loggedIn: true });
  }
  res.json({ loggedIn: false });
});

app.get('/api/user', requireAuthentication, (req, res) => {
  console.log(req.user);
  res.json(req.user);
});

function notFoundHandler(req, res) {
  res.status(500).json({ error: 'Something went wrong' });
}

function errorHandler(err, req, res) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
