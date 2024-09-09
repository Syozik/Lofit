"use client";
import styles from "./transaction.module.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "UAH", symbol: "₴" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "$" },
  { code: "AUD", symbol: "$" },
  { code: "CHF", symbol: "$" },
  { code: "CNY", symbol: "¥" },
  { code: "INR", symbol: "₹" },
  { code: "BRL", symbol: "R$" },
];

interface AccountInfo {
  id: number;
  name: string;
  balance: number;
  currency: string;
}

function DateMin(date: Date | string){
  return new Date() < new Date(date) ? new Date().toISOString().split("T")[0] : date;
}

export default function Expense() {
  const user_id = 1;
  const router = useSearchParams();
  const { transaction } = Object.fromEntries(router);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [button, setButton] = useState(0);

  const [formData, setFormData] = useState({
    id: user_id,
    type: "",
    amount: "",
    currency: "",
    date: new Date().toISOString().split("T")[0],
    section: "",
    category: "",
    description: "",
  });

  useEffect(() => {
    setFormData({ ...formData, type: transaction });
  }, [transaction]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountInfoRes = await fetch(`/api/accountInfo/${user_id}`).then(
          (res) => res.json()
        );
        setAccountInfo(accountInfoRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleTypeClick = () => {
    setFormData({
      ...formData,
      type: formData.type === "income" ? "expense" : "income",
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setButton(1);

    fetch("/api/add-transaction", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setButton(2);
        return response;
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
    setFormData({
      id: user_id,
      type: formData.type,
      amount: "",
      currency: formData.currency,
      date: new Date().toISOString().split("T")[0],
      section: "",
      category: "",
      description: "",
    });
  };

  useEffect(() => {
    if (accountInfo) {
      setFormData({ ...formData, currency: accountInfo.currency });
    }
  }, [accountInfo]);

  if (!accountInfo) return <div className={styles.spinner}></div>;

  return (
    <div className={styles.addTransaction}>
      <div className={styles.transactionType}>
        <p
          style={{
            textDecoration: formData.type === "income" ? "underline" : "none",
          }}
        >
          INCOME
        </p>
        <button
          className={styles.switch}
          onClick={handleTypeClick}
          style={{
            backgroundColor:
              formData.type === "expense"
                ? "rgba(0,0,0,0.3)"
                : "rgba(120,120,120,0.3)",
          }}
        >
          <div
            className={styles.switchCircle}
            style={{
              transform:
                formData.type === "income"
                  ? "translateX(0)"
                  : "translateX(56px)",
            }}
          ></div>
        </button>
        <p
          style={{
            textDecoration: formData.type === "expense" ? "underline" : "none",
          }}
        >
          EXPENSE
        </p>
      </div>
      <form className={styles.transactionForm} onSubmit={handleSubmit}>
        <fieldset className={styles.amount}>
          <div className={`${styles.formGroup} ${styles.amountInput}`}>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className={styles.formControl}
              placeholder=" "
              required
            />
            <label htmlFor="amount" className={styles.formLabel}>
              Amount
            </label>
          </div>
          <div className={`${styles.formGroup} ${styles.currencyInput}`}>
            <select
              id="currency"
              name="currency"
              className={styles.formControl}
              value={formData.currency}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select currency
              </option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} - {currency.code}
                </option>
              ))}
            </select>
            <label htmlFor="currency" className={styles.formLabel}>
              Currency
            </label>
          </div>
        </fieldset>
        <div className={`${styles.formGroup}`}>
          <input
            type="text"
            name="section"
            id="section"
            value={formData.section}
            onChange={handleInputChange}
            className={styles.formControl}
            placeholder=" "
            required
          />
          <label htmlFor="section" className={styles.formLabel}>
            Section
          </label>
        </div>
        <div className={`${styles.formGroup}`}>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleInputChange}
            className={styles.formControl}
            placeholder=" "
            required
          />
          <label htmlFor="category" className={styles.formLabel}>
            Category
          </label>
        </div>
        <div className={`${styles.formGroup}`}>
          <input
            type="date"
            name="date"
            id="date"
            value={DateMin(formData.date)}
            onChange={handleInputChange}
            className={styles.formControl}
            required
          />
          <label htmlFor="date" className={styles.formLabel}>
            Date
          </label>
        </div>
        <div className={`${styles.formGroup}`}>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.formControl}
            placeholder="Optional"
          />
          <label htmlFor="description" className={styles.formLabel}>
            Description
          </label>
        </div>
        <div className={styles.submitDiv}>
          <button
            type="submit"
            className={
              [styles.submitButton, styles.effect1, styles.effect2][button]
            }
          ></button>
        </div>
      </form>
    </div>
  );
}
