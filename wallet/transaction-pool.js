const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    clear() {
        this.transactionMap = {};
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    exisitingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);
        console.log(transactions);
        return transactions.find(transaction => transaction.input.address === inputAddress);
    }

    validTransactions() {
        return Object.values(this.transactionMap).filter(transaction => Transaction.validTransaction(transaction));
    }

    clearBlockchainTransactions({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }


}

module.exports = TransactionPool;