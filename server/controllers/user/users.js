/* eslint-disable guard-for-in */
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import moment from 'moment';
import { query } from '../db/db.js';

dotenv.config();

export async function findById(id) {
  if (!id) return null;
  const q = 'SELECT * FROM users WHERE `id` = ?';
  try {
    const result = await query(q, [id]);
    if (result.length > 0) {
      return result[0];
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function userIsAdmin(req, res, next) {
  if (req.user && req.user.admin) {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden' });
}

export function userIsMentor(req, res, next) {
  if (req.user && req.user.mentor) {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden' });
}

export async function allUsers() {
  const q = 'SELECT user_name, id, mentor, admin FROM users';
  try {
    const r = await query(q);
    return r;
  } catch (error) {
    return false;
  }
}

async function isUserActive(cid) {
  try {
    // eslint-disable-next-line max-len
    const q = 'SELECT * FROM training_history WHERE student_id = ? AND training = ? AND DATEDIFF(NOW(), date) > 90';
    const prev = await query(q, [cid, 'reactivacion']);
    if (prev[0] !== undefined) return true;
  } catch (error) {
    console.log(error);
  }

  const f1 = await fetch(`https://api.vatsim.net/api/ratings/${cid}/atcsessions/LE/?start=${moment().subtract(90, 'd').format('YYYY-MM-DD')}`);
  const f2 = await fetch(`https://api.vatsim.net/api/ratings/${cid}/atcsessions/GC/?start=${moment().subtract(90, 'd').format('YYYY-MM-DD')}`);
  const connectionsLE = await f1.json();
  const connectionsGC = await f2.json();
  const count = connectionsLE.count + connectionsGC.count;
  if (count === 0) return false;
  let hours = 0;
  // eslint-disable-next-line guard-for-in
  // eslint-disable-next-line no-restricted-syntax
  for (const connection in connectionsLE.results) {
    hours += connectionsLE.results[connection].minutes_on_callsign / 60;
    if (hours > 5) return true;
  }
  // eslint-disable-next-line guard-for-in
  // eslint-disable-next-line no-restricted-syntax
  for (const connection in connectionsGC.results) {
    hours += connectionsGC.results[connection].minutes_on_callsign / 60;
    if (hours > 5) return true;
  }
  return false;
}

export async function updateAccess(id, access) {
  const q = 'UPDATE users SET access = ? WHERE id = ?';
  try {
    await query(q, [id, access]);
  } catch (e) {
    console.log(e);
  }
}

export async function createUser(data, access) {
  const q = 'INSERT INTO users'
    // eslint-disable-next-line max-len
    + '(id, user_name, user_email, rating, local_controller, subdivision, active_controller, access) '
    + 'VALUES (?,?,?,?,?,?,?) RETURNING *';
  const q1 = 'INSERT INTO training_users (id) VALUES (?)';
  const active = isUserActive(data.cid);

  try {
    const result = await query(q, [
      parseInt(data.cid, 10),
      data.personal.name_full,
      data.personal.email,
      data.vatsim.rating.id,
      (data.vatsim.subdivision.code === 'SPN'),
      data.vatsim.subdivision.code,
      active,
      access,
    ]);
    await query(q1, parseInt(data.cid, 10));
    if (result.length > 0) return result;
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}
