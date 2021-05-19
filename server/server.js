import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import {
  router as authRouter,
  isAuthenticated,
  requireAuthentication,
} from './controllers/user/auth.js';
import { router as candidateRouter } from './controllers/user/candidates.js';
import { userData } from './controllers/user/users.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(authRouter);
app.use(candidateRouter);

app.get('/api/authenticated', async (req, res) => {
  if (await isAuthenticated(req)) {
    return res.json({ loggedIn: true });
  }
  return res.json({ loggedIn: false });
});

app.get('/api/user', requireAuthentication, async (req, res) => {
  const data = await userData(req.cookies.token);
  return res.json(data.data);
});

app.get('/api/user/name', requireAuthentication, async (req, res) => {
  const data = await userData(req.cookies.token);
  return res.json(data.data.personal.name_full);
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
