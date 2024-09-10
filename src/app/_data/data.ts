function getBalance(customer_id: number):object{
    return {
        "cash" : 4500,
        "CIBC": 6000,
        "stocks": 10000,
        "crypto": 1000,
        "royalties": 200,
    }
}

function getAccountInfo(customer_id: number){
    return {
        user_name: "Jason",
        currency: "$",
        joining_date: new Date("2024-08-01"),
    }
}

function getHistory(customer_id: number){
    return [
        {   
            type: "expense",
            amount: 100,
            date: new Date("2024-08-10"),
            section: "cibc",
            category: "food",
        },
        {
            type: "income",
            amount: 1000,
            date: new Date("2024-08-11"),
            section: "cibc",
            category: "salary",
        }, 
        {
            type: "expense",
            amount: 1000,
            date: new Date("2024-08-12"),
            section: "crypto",
            category: "trading",
        },
        {
            type: "income",
            amount: 3000,
            date: new Date("2024-08-13"),
            section: "crypto",
            category: "trading",
        },
        {
            type: "expense",
            amount: 1500,
            date: new Date("2024-08-14"),
            section: "cibc",
            category: "rent",
        },
        {
            type: "expense",
            amount: 300,
            date: new Date("2024-08-15"),
            section: "cash",
            category: "groceries",
        },
        {
            type: "income",
            amount: 2000,
            date: new Date("2024-08-16"),
            section: "cibc",
            category: "salary",
        },
        {
            type: "income",
            amount: 2000,
            date: new Date("2024-08-17"),
            section: "stocks",
            category: "dividends",
        },
    ]
}

export {getBalance, getAccountInfo, getHistory};