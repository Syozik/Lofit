function getBalance(customer_id: number){
    return {
        "cash" : 4500,
        "CIBC": 6000,
        "stocks": 10000,
    }
}

function getAccountInfo(customer_id: number){
    return {
        "name": "Serhii",
        "currency": "CAD"
    }
}

function getHistory(customer_id: number){
    return ;
}

export {getBalance, getAccountInfo, getHistory};