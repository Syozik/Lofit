import Plotly from "plotly.js-dist";
import {getBalance, getAccountInfo, getHistory} from '../data/data';
import { useState, useEffect } from "react";


function addDays(day: Date|string, n: number = 0){
    if (typeof day === 'string') {
        day = new Date(day);
    }
    let copy = new Date(day);
    return new Date(copy.setDate(copy.getDate() + n));
}

export default function BalanceHistoryPlot(){
    const balance = getBalance(1);
    const accountInfo = getAccountInfo(1);
    const history = getHistory(1);
    
    history.sort((a, b) => b.date.getTime() - a.date.getTime());
    let balances = [Object.values(balance).reduce((a, b) => a + b, 0)];
    let dates = [new Date()];
    for (let i = 0; i < history.length; i++) {
        if (history[i].type === "income") {
            balances.push(balances[balances.length - 1] - history[i].amount);
        } else {
            balances.push(balances[balances.length - 1] + history[i].amount);
        }
        dates.push(history[i].date);
    }
    balances.push(balances[balances.length - 1]);
    dates.push(accountInfo.joining_date);
    const [selectedDateRange, setSelectedDateRange] = useState([dates[dates.length - 1],dates[0]]);
 
    useEffect(() => {
        const trace = {
            x: dates,
            y: balances,
            type: 'scatter',
            mode: 'lines+markers',
            name:"",
            marker: {
                size: 5,
                line: {
                    color: 'rgba(0,200,20,0.7)', 
                    width: 2
                }
            },
            line: {
                color: 'rgba(57,255,20,1)',
            },
            hovertemplate: '<b>Date:</b> %{x|%B %d, %Y}<br><b>Balance:</b> $%{y}<br>'
        };

        const data = [trace];
        const layout = {
            title: {
                text: 'Balance History',
                font: { size: 32, family: "Roboto", weight: "bold", color: 'white'},
                y: 0.92,
                x: 0.1,
            },
            color: 'white',
            xaxis: {
                color: 'white',
                gridcolor: 'rgba(120,120,120,0)',
                linewidth:1, 
                linecolor:'black',
                mirror:true,
                showline:true,
                range: [addDays(selectedDateRange[0], -1), addDays(selectedDateRange[1], 1)],
            },
            yaxis: {
                color: 'white',
                rangemode: 'tozero',
                ticksuffix: "  ",
                linewidth:1, 
                linecolor:'black',
                mirror:true,
                ticks:'inside', 
                showline:true,
                gridcolor: 'rgba(120,120,120,1)',
            },
            width: 800,
            height: 550,
            plot_bgcolor: 'rgba(0,0,0,0.4)',
            paper_bgcolor: 'rgba(0,0,0,0)',
        }
        const config = {
            displayModeBar: false,
            scrollZoom: false,
        };        
        
        
        Plotly.react('balance-history-plot', data, layout, config);
    }, [selectedDateRange]);

    console.log(selectedDateRange);
    return(
        <div>
            <div id="balance-history-plot" />
                <div className = "balanceHistorySettings" style={{display: 'flex', flexDirection: 'column'}}>
                    <label style={{color: 'white', fontSize: '16px', fontWeight: 'bold'}}>Select Date Range</label>
                    <div className = "balanceHistorySettingsButtons" style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                        <button onClick={() => setSelectedDateRange([addDays(dates[0], -7), dates[0]])}>Last week</button>
                        <button onClick={() => setSelectedDateRange([new Date(new Date().setMonth(new Date().getMonth() - 1)), dates[0]])}>Last month</button>
                        <button onClick={() => setSelectedDateRange([new Date(new Date().setFullYear(new Date().getFullYear() - 1)), dates[0]])}>Last year</button>
                        <button onClick={() => setSelectedDateRange([dates[dates.length - 1], dates[0]])}>All Time</button>
                    </div>
                    <div className = "balanceHistorySettingsButtons" style={{display: 'flex', flexDirection: 'row', gap: '5px'}}>
                        <input type="date" value={addDays(selectedDateRange[0], -1).toISOString().split('T')[0]} onChange={(e) => setSelectedDateRange([new Date(e.target.value), selectedDateRange[1]])} />
                        <input type="date" value={addDays(selectedDateRange[1], -1).toISOString().split('T')[0]} onChange={(e) => setSelectedDateRange([selectedDateRange[0], new Date(e.target.value)])} />
                    </div>
            </div>
        </div>
    )
}