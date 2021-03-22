const Blockchain = require('../blockchain/blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'lista tranzactii' });

// let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

// const times = [];

// for(let i = 0; 1 < 10000; i++) {
//     prevTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;

//     blockchain.addBlock(`block ${i}`);

//     nextBlock = blockchain.chain[blockchain.chain.length-1];
//     nextTimestamp = nextBlock.timestamp;

//     timeDiff = nextTimestamp - prevTimestamp;
//     times.push(timeDiff);

//     average = times.reduce((total, num) => total + num)/times.length;

//     console.log(`Time to mine block ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms `);
// }