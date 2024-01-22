const mongoose = require('mongoose');

const ModelSchema = mongoose.Schema({
    blockNumber: {type: Number, default: 0},
    transactionHash: {type: String, default: ''},
    fromAddress: {type: String, default: ''},
    toAddress: {type:String, default: ''},
    tokenName: {type: String, default: ''},
    amount: {type: Number, default: 0},
    fee: {type: Number, default: 0}
}, {autoIndex: true, timestamps: true});

ModelSchema.set('toObject', {virtuals: true});
ModelSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('transactions', ModelSchema);