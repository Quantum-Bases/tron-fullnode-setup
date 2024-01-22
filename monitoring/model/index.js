const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.uri = "mongodb://127.0.0.1:27017/Tron";
db.transaction = require("./transactionModel");

module.exports = db;