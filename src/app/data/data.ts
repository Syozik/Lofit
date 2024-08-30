function getBalance(customer_id: number){
    return {
        "cash" : 4500,
        "CIBC": 6000,
        "stocks": 10000,
        "crypto": 1000,
        "monobank": 200,
    }
}

function getAccountInfo(customer_id: number){
    return {
        user_name: "Serhii",
        currency: "$"
    }
}

function getHistory(customer_id: number){
    return ;
}

export {getBalance, getAccountInfo, getHistory};