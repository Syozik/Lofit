"use client";
import styles from "@/app/page.module.css";
import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import dynamic from "next/dynamic";

const BalancePieChartPromise = () => import("../../plots/balancePieChart");
const BalanceHistoryPlotPromise = () =>
  import("../../plots/balanceHistoryPlot");

const BalancePieChart = dynamic(BalancePieChartPromise, { ssr: false });
const BalanceHistoryPlot = dynamic(BalanceHistoryPlotPromise, { ssr: false });

interface AccountInfo {
  user_name: string;
  currency: string;
  joining_date: Date;
  sections_balance: Record<string, number>;
  balance: number;
}

interface HistoryItem {
  date: Date;
  amount: number;
  type: "income" | "expense";
  section: "text";
  category: "text";
  description: "text";
}

interface BalanceContextType {
  accountInfo: AccountInfo;
  balance: number;
  history: HistoryItem[];
  setAccountInfo: (info: AccountInfo) => void;
  setBalance: (balance: number) => void;
  setHistory: (history: HistoryItem[]) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accountInfo, setAccountInfo] = useState<AccountInfo>(
    {} as AccountInfo
  );
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  return (
    <BalanceContext.Provider
      value={{
        accountInfo,
        balance,
        history,
        setAccountInfo,
        setBalance,
        setHistory,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalanceContext = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalanceContext must be used within a BalanceProvider");
  }
  return context;
};

export default function Balance({ user_id = 1 }: { user_id: number }) {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountInfoRes, balanceRes, historyRes] = await Promise.all([
          fetch(`/api/accountInfo/${user_id}`).then((res) => res.json()),
          fetch(`/api/balance/${user_id}`).then((res) => res.json()),
          fetch(`/api/history/${user_id}`).then((res) => res.json()),
        ]);

        setAccountInfo(accountInfoRes);
        setBalance(balanceRes.balance);
        setHistory(historyRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      {ready ? (
        <div className="charts">
          {accountInfo && balance && (
            <BalancePieChart accountInfo={accountInfo} balance={balance} />
          )}
          {accountInfo && balance && (
            <BalanceHistoryPlot
              accountInfo={accountInfo}
              balance={balance}
              history={history}
            />
          )}
        </div>
      ) : (
        <div className={styles.spinner}></div>
      )}
    </>
  );
}
