"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {getAccountInfo} from "./data/data";
import BalancePieChart from "./plots/balancePieChart";
import BalanceHistoryPlot from "./plots/balanceHistoryPlot";

export default function Home() {
  const {user_name, currency} = getAccountInfo(1272179);
  return (
    <>
      <div id="welcomeMessage">Welcome back, {user_name}!</div>
      <div className = "charts">
        <BalancePieChart />
        <BalanceHistoryPlot />
      </div>
    </>
  );
}
