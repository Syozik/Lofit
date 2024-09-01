"use client";
import styles from "./transaction.module.css";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Expense() {
  const router = useSearchParams();
  const { transaction } = Object.fromEntries(router);
  const [transactionType, setTransactionType] = useState(transaction);

  const handleClick = () => {
    setTransactionType(transactionType === "income" ? "expense" : "income");
  };

  console.log(transactionType);
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
    </div>
  );
}
