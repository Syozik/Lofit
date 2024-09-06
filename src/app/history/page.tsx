"use client";
import { useEffect, useState, useReducer } from "react";
import styles from "./history.module.css";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, loading: () => <div className={styles.spinner}></div>});

function getDate(date: Date) {
  return [
    date.toString().split("T")[0].split("-").reverse()[0],
    date.toString().split("T")[0].split("-").reverse()[1],
  ];
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function HistoryItem(props: { item: any }): React.ReactNode {
  const item = props.item;
  return (
    <div key={item.id} className={styles.historyItem}>
      <div className={styles.historyItemDate}>
        {getDate(item.date)[0]}
        <br />
        {getDate(item.date)[1]}
      </div>
      <div className={styles.historyItemCategory}>
        {item.category.toUpperCase()}
      </div>
      <div className={styles.historyItemTopRight}>
        <div
          className={styles.historyItemType}
          style={{ color: item.type === "income" ? "green" : "red" }}
        >
          {item.type}
        </div>
        <div className={styles.historyItemSection}>{item.section}</div>
      </div>
      <div className={styles.historyItemAmount}>{item.amount}$</div>
    </div>
  );
}

type HistoryItem = {
  id: number;
  date: Date;
  category: string;
  type: string;
  section: string;
  amount: number;
};

export default function History() {
  const user_id = 1;
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/history/${user_id}`)
      .then((response) => response.json())
      .then((data) => setHistory(data))
      .catch((error) => console.error("Error fetching history:", error));
    return () => {
      setHistory(null);
    };
  }, [user_id]);

  let income: HistoryItem[] = [];
  let expense: HistoryItem[] = [];
  let incomePlotData: any;
  let expensePlotData: any;

  const layout = {
    title: {
      text: "History",
      font: { size: 25, family: "Roboto", weight: "bold", color: "white" },
      y: 0.9,
    },
    xaxis: {
      title: "Date",
      type: "date",
      color: "white",
    },
    yaxis: {
      title: "Amount",
      color: "white",
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(28, 28, 30,0.6)",
    barmode: "stack",
    height: 550,
    width: 600,
  };

  const config = {
    displayModeBar: false,
  };

  if (history) {
    income = history.filter((item: HistoryItem) => item.type === "income");
    expense = history.filter((item: HistoryItem) => item.type === "expense");

    incomePlotData = {
      x: income.map((item: HistoryItem) => item.date),
      y: income.map((item: HistoryItem) => item.amount),
      type: "bar",
      marker: { color: "#81D4FA" },
    };

    expensePlotData = {
      x: expense.map((item: HistoryItem) => item.date),
      y: expense.map((item: HistoryItem) => item.amount),
      type: "bar",
      marker: { color: "#81D4FA" },
    };
  }

  const month = monthNames[new Date().getMonth()];

  return history ? (
    <div>
      <h2>History <br /> <br /> <div className={styles.month}><button className={styles.monthButton} onClick={() => setMonth(month - 1)}> {"<"}</button> <span className={styles.historyMonth}>{month}</span> <button className={styles.monthButton} onClick={() => console.log(month)}> {">"} </button></div></h2> 
      <div className={styles.historyLists}>
        <div className={styles.historyPlot}>
          {typeof window !== "undefined" && (
            <Plot
              data={[incomePlotData]}
              layout={{ ...layout, title: { ...layout.title, text: "Income" } }}
              config={config}
            />
          )}
        </div>
        <div className={styles.historyContainer}>
          <div className={styles.income}>
            {income.map((item: any, index: number) => (
              <HistoryItem key={index} item={item} />
            ))}
          </div>
        </div>
        <div className={styles.historyPlot}>
          {typeof window !== "undefined" && (
            <Plot
              data={[expensePlotData]}
              layout={{ ...layout, title: { ...layout.title, text: "Expense" } }}
              config={config}
            />
          )}
        </div>
        <div className={styles.historyContainer}>
          <div className={styles.expense}>
            {expense.map((item: any, index: number) => (
              <HistoryItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.incomeTotal}> Income total: {income.reduce((acc, item) => acc + item.amount, 0)}$</div>
      <div className={styles.expenseTotal}> Expense total: {expense.reduce((acc, item) => acc + item.amount, 0)}$</div>
      <div className={styles.total}>Total: {income.reduce((acc, item) => acc + item.amount, 0) - expense.reduce((acc, item) => acc + item.amount, 0)}$</div>
    </div>
  ) : (
    <div className={styles.spinner}></div>
  );
}
