const mongoose = require('mongoose')

// Crypto Token Schema
var CryptoTokenSchema = new mongoose.Schema({
    crypto_token_name: { type: String, required: true },
    crypto_token: { type: String, required: true, unique: true },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})

// Crypto Token model
module.exports = mongoose.model("CryptoToken", CryptoTokenSchema)
