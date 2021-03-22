const PubNub = require('pubnub');
const { database } = require('../firebase/realtimeDB');

const credentials = {
    publishKey: 'pub-c-b07a95b6-dace-4f9f-93db-9d64895a12e9',
    subscribeKey: 'sub-c-56f741fc-2a61-11eb-ae78-c6faad964e01',
    secretKey: 'sec-c-M2MxMDYxMTUtZmU1MS00NWM0LThhMjYtMzRiN2Y3ZGM1NWFi'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION',
    ALTERNATIVECHAIN: 'ALTERNATIVECHAIN'
}

class PubSub {
    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}. Message: ${message}`);

                const parsedMessage = JSON.parse(message);

                switch (channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.clearBlockchainTransactions({ chain: parsedMessage })

                        });

                        break;
                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.existingTransaction({
                            inputAddress: this.wallet.publicKey
                        })) {
                            this.transactionPool.setTransaction(parsedMessage);
                        }
                        break;
                    default:
                        return;
                }
            }
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });

        try {
            database.ref().set({ chain: this.blockchain.chain });
            console.log('test');
        } catch (error) {
            console.log(error.message);
        }
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}


module.exports = PubSub;