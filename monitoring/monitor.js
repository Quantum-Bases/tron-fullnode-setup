const tronweb = require('tronweb');
const db = require("./model");

const walletAddress = ["TAUykNuqJrJdxcKagKmRqEjzsYm52Uyung",
]
let lastBlock;
let blockArray = [];

const HttpProvider = tronweb.providers.HttpProvider;
let fullNode = new HttpProvider("http://localhost:8090/");
let solidityNode = new HttpProvider("http://localhost:8091");
let eventServer = "http://localhost:8092";

db.mongoose.connect(db.uri)
    .then(() => {
        console.log('server connected to mongodb successfully.');
    }).catch((err) => {
        console.error({ title: 'Mongodb connection error', message: err.message });
        process.exit();
    });
const TransactionModel = db.transaction;

const Tronweb = new tronweb(fullNode, solidityNode, eventServer);

async function getLastBlock() {
    let latestBlock = await Tronweb.trx.getCurrentBlock();
    return latestBlock;
}

async function analyzeTransactions() {
    let block = await getLastBlock();
    if (lastBlock != block.block_header.raw_data.number) lastBlock = block.block_header.raw_data.number;
    else return;
    console.log("Latest Block: ", block.block_header.raw_data.number);
    blockArray.push(block);
    if (blockArray.length < 30) return;
    let currentBlock = blockArray.shift();
    
    console.log("currentBlock: ", currentBlock.block_header.raw_data.number);

    for (let tx of currentBlock.transactions) {
        const transaction = tx;
        const transaction_info = await Tronweb.trx.getTransactionInfo(tx.txID);

        let raw_data = transaction.raw_data.contract[0].parameter.value;
        let fromAddress = Tronweb.address.fromHex(raw_data.owner_address);
        let toAddress = Tronweb.address.fromHex(raw_data.to_address);
        let contractAddress = Tronweb.address.fromHex(raw_data.contract_address);
        let amount = 0;
        let fee = 0;
        let name = '';

        console.log("This is address: ", fromAddress, toAddress, contractAddress);

        if (!toAddress && !contractAddress) continue;

        if (!toAddress) {
            toAddress = Tronweb.address.fromHex(raw_data.data.slice(30, 72));
            var contract_info = await Tronweb.trx.getContract(contractAddress);
            if (contract_info.name) {
                name = contract_info.name;
            }

            if (transaction_info.log) {
                var amount_ = transaction_info.log[0].data;
                amount = parseInt(amount_, 16) / 1000000;
                fee = transaction_info.fee / 1000000;
            }
        } else {
            amount = raw_data.amount / 1000000;
            name = "TRX";
            fee = transaction_info.receipt.net_usage;
        }

        if (fee == NaN) continue;

        console.log("this is saved data: ", fromAddress, toAddress, name, amount, fee);

        if (walletAddress.includes(fromAddress) || walletAddress.includes(toAddress))
            new TransactionModel({
                blockNumber: currentBlock.block_header.raw_data.number,
                transactionHash: tx.txID,
                fromAddress: fromAddress,
                toAddress: toAddress,
                tokenName: name,
                amount: amount,
                fee: fee
            }).save();
    }
}

setInterval(() => analyzeTransactions(), 500);