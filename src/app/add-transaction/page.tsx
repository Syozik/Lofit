"use client";
import styles from "./transaction.module.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'CAD', symbol: '$' },
  { code: 'AUD', symbol: '$' },
  { code: 'CHF', symbol: '$' },
  { code: 'UAH', symbol: '₴' },
  { code: 'CNY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
  { code: 'BRL', symbol: 'R$' },
];

interface AccountInfo {
  id: number;
  name: string;
  balance: number;
  currency: string;
}

export default function Expense() {

  const user_id = 1;
  const router = useSearchParams();
  const { transaction } = Object.fromEntries(router);
  const [transactionType, setTransactionType] = useState(transaction);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [currency, setCurrency] = useState("");
  const [button, setButton] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountInfoRes = await fetch(`/api/accountInfo/${user_id}`).then((res) => res.json());
        setAccountInfo(accountInfoRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleClick = () => {
    setTransactionType(transactionType === "income" ? "expense" : "income");
  };
  
  useEffect(() => {
    if (accountInfo) {
      setCurrency(accountInfo.currency);
      console.log(accountInfo);
    }
  }, [accountInfo]);

 
  if (!accountInfo) return <div className={styles.spinner}></div>;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setButton(1);
    setTimeout(() => {
      setButton(2);
    }, 1000);
    console.log("Form submitted");
  };
  return (
    <div className={styles.addTransaction}>
      <div className={styles.transactionType}>
        <p style={{textDecoration: transactionType === "income" ? "underline" : "none"}}>INCOME</p>
        <button className={styles.switch} onClick={handleClick} style={{backgroundColor: transactionType === "expense" ? "rgba(0,0,0,0.3)" : "rgba(120,120,120,0.3)"}}>
          <div className={styles.switchCircle}
           style={{transform: transactionType === "income" ? "translateX(0)" : "translateX(56px)",}}></div>
        </button>
        <p style={{textDecoration: transactionType === "expense" ? "underline" : "none"}}>EXPENSE</p>
      </div>
      <form className={styles.transactionForm}>

      <fieldset className={styles.amount}>
        <div className={`${styles.formGroup} ${styles.amountInput}`}>
          <input type="text" id="amount" className={styles.formControl} placeholder=" " required/>
          <label htmlFor="amount" className={styles.formLabel}>Amount</label>
        </div>
        <div className={`${styles.formGroup} ${styles.currencyInput}`}>
          <select 
          id="currency" 
          className={styles.formControl} 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}>
            <option value="" disabled>Select currency</option>
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} - {currency.code}
              </option>
            ))}
          </select>
          <label htmlFor="currency" className={styles.formLabel}>Currency</label>
        </div>
      </fieldset>
      <div className={`${styles.formGroup}`}>
          <input type="text" id="section" className={styles.formControl} placeholder=" " required/>
          <label htmlFor="section" className={styles.formLabel}>Section</label>
        </div>
        <div className={`${styles.formGroup}`}>
          <input type="date" id="date" className={styles.formControl} defaultValue={new Date().toISOString().split('T')[0]} required/>
          <label htmlFor="date" className={styles.formLabel} >Date</label>
        </div>
        <div className={`${styles.formGroup}`}>
          <textarea id="description" className={styles.formControl} placeholder="Optional" />
          <label htmlFor="description" className={styles.formLabel} >Description</label>
        </div>
        <div className={styles.submitDiv}><button type="submit" className={[styles.submitButton, styles.effect1, styles.effect2][button]} onClick={handleSubmit}></button></div>
      </form>
    </div>
  );
}
