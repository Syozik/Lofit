"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {getAccountInfo} from "./data/data";
import {useState, useEffect} from "react";
import dynamic from 'next/dynamic';

const BalancePieChartPromise = () => import('./plots/balancePieChart');
const BalanceHistoryPlotPromise = () => import('./plots/balanceHistoryPlot');

const BalancePieChart = dynamic(BalancePieChartPromise, { ssr: false });
const BalanceHistoryPlot = dynamic(BalanceHistoryPlotPromise, { ssr: false });

export default function Home() {
  
  const {user_name, currency} = getAccountInfo(1272179);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([BalancePieChartPromise(), BalanceHistoryPlotPromise()]).then(() => {
      setReady(true);
    });
  }, []);
  
  return (
    <>
      <div id="welcomeMessage">Welcome back, {user_name}!</div>
      {ready ? <div className = "charts">
        <BalancePieChart />
        <BalanceHistoryPlot />
      </div> : <div className={styles.spinner}></div>}
    </>
  );
}
