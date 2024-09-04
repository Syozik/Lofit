import React, { useEffect, useState } from "react";
import Plotly from "plotly.js-dist";

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
  const [total, setTotal] = useState(0);


  useEffect(() => {
    if (accountInfo && balance !== null) {
      console.log(balance);
      const initialTotal = balance;
      setTotal(initialTotal);

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
          text: `Your Balance: ${initialTotal}${accountInfo.currency}`,
          font: { size: 32, family: "Roboto", weight: "bold", color: "white" },
          y: 2,
          x: 0.5,
          xanchor: "center",
          yanchor: "top",
        },
        legend: {
          font: { size: 15, color: "white" },
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
        const hidden = eventData.hiddenlabels.map((label: any) => {
          const [name, value] = label.split(" - ");
          return parseFloat(value.slice(0, value.length - 1));
        });
        const newBalance = hidden.reduce((total: number, value: number) => {
          return total - value;
        }, initialTotal);
        setTotal(newBalance);
      };

      Plotly.react("balancePlot", data, layout, config).then((plot: any) => {
        plot.on("plotly_relayout", updateTitle);
      });
    }
  }, [accountInfo, balance]);

  let totalStyle = { transform: `translateX(${52 - 6 * numLength(total)}px)`, color: "white" };

  return (
    <div id="balancePlot">
      <div id="total" style={totalStyle}>
        {new Intl.NumberFormat().format(total)}{accountInfo?.currency}
      </div>
    </div>
  );
}