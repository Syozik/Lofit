"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {getBalance, getAccountInfo, getHistory} from "./data/data.ts";
import { useEffect } from "react";
import Plotly from "plotly.js-dist";

export default function Home() {
  let balance = getBalance(1272179);
  let formattedLabels = Object.keys(balance).map(
    (key) => `${key.toUpperCase()} - ${balance[key]}$`
  );
  let total = Object.values(balance).reduce(
    (partialSum, a) => partialSum + a,
    0
  );
  let data = [
    {
      values: Object.values(balance),
      labels: formattedLabels,
      hoverinfo: `label`,
      hole: 0.25,
      type: "pie",
    },
  ];

  const layout = {
    title: {
      text: `Your Balance: ${total}$`,
      font: { size: 32, family: "Roboto", weight: "bold" },
      y: 0.87,
      x: 0.4,
      xanchor: "center",
      yanchor: "top",
    },
    legend: {
      font: { size: 15, color: "white"},
      y: 0.97,
      x: 1,
      bgcolor: "rgba(0, 0, 0, 0.3)",
      bordercolor: "#FFFFFF",
      borderwidth: 1,
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    height: 500,
    width: 550,
    automargin: true,
    autosize: true,
  };

  const config = {
    // displaylogo: false,
    displayModeBar: false,
  };
  useEffect(() => {
    Plotly.newPlot("balancePlot", data, layout, config);
  }, []);

  return (
    <main>
      <div id="balancePlot"></div>
    </main>
  );
}
