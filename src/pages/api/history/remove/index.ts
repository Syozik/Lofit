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
  if (req.method != 'POST') {
    res.status(405).json({message: 'Method not allowed'});
    return;
  }
  try{
    const { item } = req.body;
    const balanceDiff = item.type === "income" ? item.amount : -item.amount;
      await pool.query(
        'UPDATE users SET balance = balance - $1 WHERE id = $2;',
        [balanceDiff, item.id]
      );

    const result = await pool.query("select sections_balance from users where id = $1", [item.id]);
    const sectionsBalance = result.rows[0].sections_balance;
    const newSectionsBalance = {...sectionsBalance, [item.section]: (sectionsBalance[item.section] || 0) - balanceDiff};
    if (newSectionsBalance[item.section] == 0) {
      delete newSectionsBalance[item.section];
    }
    await pool.query("UPDATE users SET sections_balance = $1 WHERE id = $2;", [newSectionsBalance, item.id]);
    await pool.query('DELETE FROM transactions WHERE id = $1 AND type = $2 AND amount = $3 AND date = $4 AND section = $5 AND category = $6 AND description = $7', [item.id, item.type, item.amount, item.date, item.section, item.category, item.description]);
    res.status(200).json({message: 'Transaction removed'});
  }
  catch(err){
    console.error('Error executing query', err);
    res.status(500).json({error: 'Error executing query'});
  }
}