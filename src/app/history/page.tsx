"use client";
import { useEffect, useState } from "react";
import styles from "./history.module.css";


function getDate(date: Date){
  return [date.toString().split('T')[0].split('-').reverse()[0], date.toString().split('T')[0].split('-').reverse()[1]];
}

function HistoryItem(props: {item: any}): React.ReactNode{
  const item = props.item;
  return(
    <div key={item.id} className={styles.historyItem}>
      <div className={styles.historyItemDate}>{getDate(item.date)[0]}<br/>{getDate(item.date)[1]}</div>
      <div className={styles.historyItemCategory}>{item.category.toUpperCase()}</div>
      <div className={styles.historyItemTopRight}>
        <div className={styles.historyItemType} style={{color: item.type === 'income' ? 'green' : 'red'}}>{item.type}</div>
        <div className={styles.historyItemSection}>{item.section}</div>
      </div>
      <div className={styles.historyItemAmount}>{item.amount}$</div>
    </div>
  )
}

export default function History(){
  const user_id = 1;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/history/${user_id}`)
      .then(response => response.json())
      .then(data => setHistory(data))
      .catch(error => console.error('Error fetching history:', error));
  }, [user_id]);

  return( history ?
        <div>
            <h1>History</h1>
            <div className={styles.historyLists}>
              <div className={styles.historyContainer}>
                <div className={styles.income}>
                  {history.filter((item: any) => item.type === 'income').map((item: any) => (
                      <HistoryItem item={item} />
                  ))}
                </div>
                </div>
                <div className={styles.historyContainer}>
                <div className={styles.expense}>
                  {history.filter((item: any) => item.type === 'expense').map((item: any) => (
                      <HistoryItem item={item} />
                  ))}
                </div>
              </div>
            </div>
        </div> : <div className={styles.spinner}>Loading...</div>
    )
}