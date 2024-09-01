import {getBalance, getAccountInfo, getHistory} from "../data/data";
import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-dist";

function numLength(num: number): number {
  return num.toString().includes(".")? num.toString().length-1 : num.toString().length;
}

export default function  BalancePieChart(){
  const balance = getBalance(1272179) as Record<string, number>;
  const {user_name, currency} = getAccountInfo(1272179);
  const initialTotal = Object.values(balance).reduce(
    (partialSum, a) => partialSum + a,
    0);
  const [total, setTotal] = useState(initialTotal/1000);
  
  
  useEffect(() => {
    const formattedLabels = Object.keys(balance).map(
      (key) => `${key.toUpperCase()} - ${balance[key]}${currency}`
    );
    
    const data = [
    {
      values: Object.values(balance),
      labels: formattedLabels,
      hoverinfo: `label`,
      hole: 0.25,
      direction: 'clockwise',
      sort: true,
      type: "pie",
      marker: {
        colors: ['#1f77b4', '#ff7f0e', '#5e45b9', '#d62728', '#9467bd']
        },
      },
    ];

  const layout = {
    color: "white",
    title: {
      text: `Your Balance: ${initialTotal}${currency}`,
      font: { size: 32, family: "Roboto", weight: "bold" , color: "white"},
      y: 2,
      x: 0.5,
      xanchor: "center",
      yanchor: "top",
    },
    legend: {
      font: { size: 15, color: "white"},
      y: 1,
      x: 0.85,
        bgcolor: "rgba(0, 0, 0, 0.3)",
        bordercolor: "#FFFFFF",
        borderwidth: 1,
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      height: 550,
      width: "800",
      automargin: true,
      autosize: true,
    };

    const config = {
      displayModeBar: false,
    };
    
    const updateTitle = (eventData: any) => {
      const hidden = eventData.hiddenlabels.map((label: any) =>{
        const [name, value] = label.split(' - ');
        return value.slice(0,value.length-1);
      });
      const newBalance = hidden.reduce((total: number, value: number) => {
        return total - value;
      }, initialTotal);
      setTotal(newBalance/1000);
    };

    Plotly.react("balancePlot", data, layout, config).then((plot: any) => {
      plot.on('plotly_relayout', updateTitle);
    });
    
  }, []);

  let totalStyle = {transform: `translateX(${52 - 6*numLength(total)}px)`, color: "white"};

  return (
      <div id="balancePlot"><div id="total" style={totalStyle}>{total}K{currency}</div></div>
  );
}
