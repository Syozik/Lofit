import type { NextApiRequest, NextApiResponse } from 'next';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'GET') {
    res.status(405).json({message: 'Method not allowed'});
    return;
  }

  const { id } = req.query;
  console.log(req.body)
  if (!id) {
    res.status(400).json({ error: 'ID is required' });
    return;
  }

  try {
    const accountInfo = await pool.query(
      'SELECT id, type, amount, date, section, category, description FROM transactions WHERE id = $1 ORDER BY date DESC;',
      [id]
    );

    if (accountInfo.rows.length === 0) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    res.status(200).json(accountInfo.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error smth went wrong' });
  }
}
