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
  const {id, type, amount, currency, category, date, description} = req.body;
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO transactions (user_id, type, amount, currency, category, date, description) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, type, amount, currency, category, date, description]
    );
    res.status(200).json({ message: 'Transaction added successfully' });
  } catch (error) {
    console.error('Error adding transaction', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}