"use client";
import styles from "../page.module.css";
import {getAccountInfo} from "../data/data";
import {useState, useEffect} from "react";
import dynamic from 'next/dynamic';

const BalancePieChartPromise = () => import('../plots/balancePieChart');
const BalanceHistoryPlotPromise = () => import('../plots/balanceHistoryPlot');

const BalancePieChart = dynamic(BalancePieChartPromise, { ssr: false });
const BalanceHistoryPlot = dynamic(BalanceHistoryPlotPromise, { ssr: false });

export default function Balance() {
  
  const {user_name, currency} = getAccountInfo(1272179);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([BalancePieChartPromise(), BalanceHistoryPlotPromise()]).then(() => {
      setReady(true);
    });
  }, []);
  
  return (
    <>
      {ready ? <div className = "charts">
        <BalancePieChart />
        <BalanceHistoryPlot />
      </div> : <div className={styles.spinner}></div>}
    </>
  );
}
