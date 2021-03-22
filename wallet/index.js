const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');
const { ec } = require('../util')
const cryptoHash = require('../util/crypto-hash');

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ recipient, amount, chain }) {
        if (chain) {
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            })
        }

        if (amount > this.balance) {
            throw new Error('Amount exceedes balance');
        }

        return new Transaction({ senderWallet: this, recipient, amount });
    }

    static calculateBalance({ chain, address }) {
        let hasConductedTransactions = false;
        let total = 0;

        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (transaction.input.address === address) {
                    hasConductedTransactions = true;
                }
                const addressOutput = transaction.outputMap[address];

                if (addressOutput) {
                    total += addressOutput;
                }

            }

            if (hasConductedTransactions) {
                break;
            }
        }
        return hasConductedTransactions ? total : INITIAL_BALANCE + total;
    }


}


module.exports = Wallet;