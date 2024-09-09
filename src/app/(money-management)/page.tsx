"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect, useContext } from "react";
import Balance from "./balance/page";
import dynamic from "next/dynamic";

const BalancePieChartPromise = () => import("../plots/balancePieChart");
const BalanceHistoryPlotPromise = () => import("../plots/balanceHistoryPlot");

const BalancePieChart = dynamic(BalancePieChartPromise, { ssr: false });
const BalanceHistoryPlot = dynamic(BalanceHistoryPlotPromise, { ssr: false });

export default function Home() {
  const { user_name, currency } = { user_name: "Serhii", currency: "$" };
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([BalancePieChartPromise(), BalanceHistoryPlotPromise()]).then(
      () => {
        setReady(true);
      }
    );
  }, []);

  return (
    <>
      <div id="welcomeMessage">Welcome back, {user_name}!</div>
      <Balance user_id={1} />
    </>
  );
}
