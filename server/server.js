import express from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from 'passport';
import path, { dirname } from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import {
  router as authRouter,
  requireAuthentication,
} from './controllers/auth/auth.js';
import {
  allUsers,
  findById,
} from './controllers/user/users.js';
import {
  router as adminRouter
} from './controllers/user/admin.js';
import {
  router as trainingRouter,
} from './controllers/training/training.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const IP = process.env.IP || '127.0.0.1';

const app = express();
app.use(express.static(path.join(__dirname, '/../client/build')));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use(authRouter);
app.use(trainingRouter);
app.use(adminRouter);

/*
app.use(function (req, res, next) {
  if (req.path.includes('/api')) {
    if (req.ip.replace('::ffff:', '') !== IP) {
      return res.status(401).json({ error: 'Permission denied' });
    }
  }
  next();
});
*/

const apiRequestLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  handler: function (req, res) {
    return res.status(429).json({
      error: 'You sent too many requests. Please wait a while then try again'
    })
  }
});

app.use(apiRequestLimiter)

app.get('/api/authenticated', async (req, res) => {
  if (req.user && req.user.id) {
    return res.json({ loggedIn: req.user.id });
  }
  return res.json({ loggedIn: false });
});

app.get('/api/user', requireAuthentication, async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    return res.status(500).json({ error: 'error' })
  }
});

app.get('/api/user/name', requireAuthentication, async (req, res) => {
  try {
    return res.json(req.user.user_name);
  } catch (error) {
    return res.status(500).json({ error: 'error' })
  }

});

app.get('/api/user/id', requireAuthentication, async (req, res) => {
  try {
    return res.json(req.user.id);
  } catch (error) {
    return res.status(500).json({ error: 'error' })
  }
});

app.get('/api/user/admin', requireAuthentication, (req, res) => {
  if (req.user && req.user.admin) {
    return res.json(true);
  }
  return res.json(false);
});

app.get('/api/user/mentor', requireAuthentication, (req, res) => {
  if (req.user && req.user.mentor) {
    return res.json(true);
  }
  return res.json(false);
});

app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  if (id === undefined || parseInt(id) === undefined || isNaN(parseInt(id)))
    return res.status(500).json('Something went wrong');
  const data = await findById(id);
  return res.json(data);
});

app.get('/api/users', async (req, res) => {
  return res.json(await allUsers());
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/build/index.html'));
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
