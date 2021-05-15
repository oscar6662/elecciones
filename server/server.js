import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import { router as authRouter } from './controllers/user/auth.js';
import {requireAuthentication} from './controllers/user/auth.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(authRouter);

app.get("/", (req,res)=>{
  if(!true){
    res.redirect('/auth')
  }
});

app.get('/api/caroline', requireAuthentication, (req,res)=>{
  return res.json("YES CAROLINE");
})

function notFoundHandler(req, res, next) {
  res.redirect('/')
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});