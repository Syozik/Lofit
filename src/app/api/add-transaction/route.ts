// app/api/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import pkg from 'pg';
import dotenv from 'dotenv';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    await pool.query(
      'INSERT INTO transactions (id, type, amount, section, date, description, category) VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [formData.id, formData.type, new Number(formData.amount), formData.section, new Date(formData.date), formData.description, formData.category]
    );
    
    const balanceDiff = formData.type === "income" ? formData.amount : -formData.amount;
    await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2;',
      [balanceDiff, formData.id]
    );

    const result = await pool.query("SELECT sections_balance FROM users WHERE id = $1", [formData.id]);
    const sectionsBalance = result.rows[0].sections_balance;
    const newSectionsBalance = {...sectionsBalance, [formData.section]: (sectionsBalance[formData.section] || 0) + balanceDiff};
    await pool.query("UPDATE users SET sections_balance = $1 WHERE id = $2;", [newSectionsBalance, formData.id]);

    return NextResponse.json({ message: 'Transaction added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding transaction', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
