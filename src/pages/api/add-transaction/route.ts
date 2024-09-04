import type { NextApiRequest, NextApiResponse } from 'next';
import pkg from 'pg';
import dotenv from 'dotenv';
import {IncomingForm} from 'formidable';

dotenv.config();
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

interface ParsedFields {
  id: string;
  type: "income" | "expense" | "";
  amount: number;
  currency: string;
  date: Date;
  section: string;
  category: string;
  description: string;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const form = new IncomingForm();

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      console.error('Error parsing form data', err);
      res.status(500).json({ error: 'Error parsing form data' });
      return;
    }

    const parsedFields: ParsedFields = {
      id: fields.id?.[0] || '',
      type: fields.type?.[0] || '',
      amount: parseFloat(fields.amount?.[0] || '0'),
      currency: fields.currency?.[0] || '',
      date: new Date(fields.date?.[0] || ''),
      section: fields.section?.[0] || '',
      category: fields.category?.[0] || '',
      description: fields.description?.[0] || '',
    };
    try {
      await pool.query(
        'INSERT INTO transactions (id, type, amount,  section, date, description, category) VALUES ($1, $2, $3, $4, $5, $6, $7);',
        [parsedFields.id, parsedFields.type, parsedFields.amount, parsedFields.section, parsedFields.date, parsedFields.description, parsedFields.category]
      );
      
      const balanceDiff = parsedFields.type === "income" ? parsedFields.amount : -parsedFields.amount;
      await pool.query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2;',
        [balanceDiff, parsedFields.id]
      );

      const result = await pool.query("select sections_balance from users where id = $1", [parsedFields.id]);
      const sectionsBalance = result.rows[0].sections_balance;
      console.log(sectionsBalance);
      const newSectionsBalance = {...sectionsBalance, [parsedFields.section]: (sectionsBalance[parsedFields.section] || 0) + balanceDiff};
      await pool.query("UPDATE users SET sections_balance = $1 WHERE id = $2;", [newSectionsBalance, parsedFields.id]);
      const res2 = await pool.query("select * from transactions where id = $1", [parsedFields.id]);
      console.log(res2.rows);
      res.status(200).json({ message: 'Transaction added successfully' });
    } catch (error) {
      console.error('Error adding transaction', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}