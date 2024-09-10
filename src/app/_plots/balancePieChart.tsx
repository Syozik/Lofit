import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-dist";
import Plot from "react-plotly.js";

function numLength(num: number): number {
  return num.toString().includes(".") ? num.toString().length - 1 : num.toString().length;
}

interface AccountInfo {
  user_name: string;
  currency: string;
  joining_date: Date;
  sections_balance: Record<string, number>;
  balance: number;
}

export default function BalancePieChart({ accountInfo, balance }: { accountInfo: AccountInfo, balance: number}) {
  const [total, setTotal] = useState(balance);
  const formattedLabels = Object.keys(accountInfo.sections_balance).map(
    (key) => `${key.toUpperCase()} - ${accountInfo.sections_balance[key]}${accountInfo.currency}`
  );

  const data = [
    {
      values: Object.values(accountInfo.sections_balance),
      labels: formattedLabels,
      hoverinfo: `label`,
      hole: 0.25,
      direction: "clockwise",
      sort: true,
      type: "pie",
      marker: {
        colors: ['#1f77b4', '#ff7f0e', '#5e45b9', '#d62728', '#9467bd'],
      },
    },
  ];

  const layout = {
    color: "white",
    title: {
      text: `Your Balance: ${balance}${accountInfo.currency}`,
      font: { size: 32, family: "Roboto", weight: "bold", color: "white" },
      y: 2,
      x: 0.45,
      xanchor: "center",
      yanchor: "top",
    },
    legend: {
      font: { size: 15, color: "white" },
      y: 1,
      x: 1,
      bgcolor: "rgba(0, 0, 0, 0.3)",
      bordercolor: "#FFFFFF",
      borderwidth: 1,
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    height: 550,
    width: 650,
    automargin: true,
    autosize: true,
  };

  const config = {
    displayModeBar: false,
  };

  const updateTitle = (eventData: any) => {
    const hidden = eventData.hiddenlabels.map((label: any) => {
      const [name, value] = label.split(" - ");
      return parseFloat(value.slice(0, value.length - 1));
    });
    const newBalance = hidden.reduce((total: number, value: number) => {
      return total - value;
    }, balance);
    setTotal(newBalance);
  };


  let totalStyle = { transform: `translateX(${52 - 6 * numLength(total)}px)`, color: "white" };

  return (
    <>
    <Plot data={data} layout = {layout} config = {config} />
      <div id="total" style={totalStyle}>
        {new Intl.NumberFormat().format(total)}{accountInfo?.currency}
      </div>
    </>
  );
}