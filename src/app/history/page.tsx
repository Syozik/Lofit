"use client";
import { useEffect, useState, useReducer } from "react";
import styles from "./history.module.css";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className={styles.spinner}></div>,
});

function getDate(date: Date) {
  return [
    date.toString().split("T")[0].split("-").reverse()[0],
    date.toString().split("T")[0].split("-").reverse()[1],
  ];
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function reducer(
  state: { isClicked: boolean; isClickedToRemove: boolean },
  action: string
) {
  switch (action) {
    case "description":
      return { ...state, isClicked: !state.isClicked };
    case "clickToRemove":
      return { ...state, isClickedToRemove: !state.isClickedToRemove };
    default:
      return state;
  }
}

function HistoryItem(props: {
  item: any;
  removeItem: (object: any) => void;
}): React.ReactNode {
  const item = props.item;
  const [state, dispatch] = useReducer(reducer, {
    isClicked: false,
    isClickedToRemove: false,
  });


  return (
    <div
      key={item.id}
      className={`${styles.historyItem} ${
        state.isClickedToRemove ? styles.clickedToRemove : ""
      }`}
      style={{ color: state.isClickedToRemove ? "rgba(0,0,0,0.3)" : "black" }}
      onClick={() => dispatch("description")}
    >
      <div
        className={styles.historyItemDate}
        style={{ color: state.isClickedToRemove ? "rgba(0,0,0,0.3)" : "black" }}
      >
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
          style={{
            color: state.isClickedToRemove
              ? item.type === "income"
                ? "rgba(0,128,0,0.3)"
                : "rgba(255,0,0,0.3)"
              : item.type === "income"
              ? "green"
              : "red",
          }}
        >
          {item.type}
        </div>
        <div className={styles.historyItemSection}>{item.section}</div>
      </div>
      <div className={styles.historyItemAmount}>{item.amount}$</div>
      <div
        className={styles.historyItemDescription}
        style={{
          opacity: state.isClicked ? 1 : 0,
          height: state.isClicked ? "auto" : 0,
          transition: "all 0.3s ease-out",
        }}
      >
        {item.description || "No description"}
      </div>
      <button
        className={styles.historyItemRemove}
        style={{ display: state.isClickedToRemove ? "none" : "block" }}
        onClick={(e) => {
          dispatch("clickToRemove");
          e.stopPropagation();
        }}
      >
        <img
          className={styles.historyItemRemoveImg}
          src="delete.svg"
          alt="delete"
        />
      </button>
      <button
        className={styles.yesButton}
        onClick={(e) => {
          e.stopPropagation();
          props.removeItem(props.item);
        }}
        style={{ display: state.isClickedToRemove ? "block" : "none" }}
      >
        <img className={styles.yesButtonImg} src="yes.svg" alt="yes" />
      </button>
      <button
        className={styles.noButton}
        onClick={(e) => {
          dispatch("clickToRemove");
          e.stopPropagation();
        }}
        style={{ display: state.isClickedToRemove ? "block" : "none" }}
      >
        <img className={styles.noButtonImg} src="no.svg" alt="no" />
      </button>
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
  const [month, setMonth] = useState(new Date().getMonth());

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
  let layout: any;

  const config = {
    displayModeBar: false,
  };

  if (history) {
    income = history.filter((item: HistoryItem) => item.type === "income" && new Date(item.date).getMonth() == month);
    expense = history.filter((item: HistoryItem) => item.type === "expense" && new Date(item.date).getMonth() == month);

    const createPlotData = (data) => {
      const xValues = data.map((item) => item.date);
      const yValues = data.map((item) => item.amount);
      let copy = new Date(xValues[0]);
      xValues.push(copy.setDate(copy.getDate()+2));
      yValues.push(0)
      console.log(xValues);
      const colors = data.map((item) => item.type === "income" ? "rgb(96, 252, 96)" : "rgb(226, 38, 38)");
      return {
        x: xValues,
        y: yValues,
        type: "bar",
        marker: { color: colors },
      };
    };

    incomePlotData = createPlotData(income);
    expensePlotData = createPlotData(expense);

    layout = {
      title: {
        text: "History",
        font: { size: 25, family: "Roboto", weight: "bold", color: "white" },
        y: 0.9,
      },
      xaxis: {
        title: "Date",
        type: "date",
        range: [new Date(new Date().getFullYear(), month, 1).getTime(), new Date(new Date().getFullYear(), month + 1, 0).getTime()],
        color: "white",
      },
      yaxis: {
        color: "white",
      },
      hovermode: 'unified',
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(28, 28, 30,0.6)",
      height: 550,
      width: 600,
    };
    
  }

  const removeItem = (item: HistoryItem) => {
    if (history) {
      setHistory(history.filter((obj: HistoryItem) => obj !== item));
      console.log(history.filter((obj: HistoryItem) => obj !== item));
    }
    fetch(`http://localhost:3000/api/history/remove`, {
      body: JSON.stringify({ item }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return history ? (
    <div>
      <h2>
        <br />
        <div className={styles.month}>
          <button
            className={styles.monthButton}
            onClick={() => setMonth(month == 0 ? 11 : month - 1)}
          >
            {" "}
            {"<"}
          </button>{" "}
          <span className={styles.historyMonth}>{monthNames[month]}</span>{" "}
          <button
            className={styles.monthButton}
            onClick={() => setMonth((month + 1) % 12)}
          >
            {" "}
            {">"}{" "}
          </button>
        </div>
      </h2>
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
              <HistoryItem key={item.id+item.type+item.date+item.amount+item.section+item.category+item.description} item={item} removeItem={removeItem} />
            ))}
          </div>
        </div>
        <div className={styles.historyPlot}>
          {typeof window !== "undefined" && (
            <Plot
              data={[expensePlotData]}
              layout={{
                ...layout,
                title: { ...layout.title, text: "Expense" },
              }}
              config={config}
            />
          )}
        </div>
        <div className={styles.historyContainer}>
          <div className={styles.expense}>
            {expense.map((item: any, index: number) => (
              <HistoryItem key={index} item={item} removeItem={removeItem} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.incomeTotal}>
        {" "}
        INCOME: {income.reduce((acc, item) => acc + item.amount, 0)}$
      </div>
      <div className={styles.expenseTotal}>
        {" "}
        EXPENSES: {expense.reduce((acc, item) => acc + item.amount, 0)}$
      </div>
      <div className={styles.total}>
        TOTAL:{" "}
        {income.reduce((acc, item) => acc + item.amount, 0) -
          expense.reduce((acc, item) => acc + item.amount, 0)}
        $
      </div>
    </div>
  ) : (
    <div className={styles.spinner}></div>
  );
}
