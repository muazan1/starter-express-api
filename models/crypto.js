const mongoose = require('mongoose')

// Schema for CryptoTokens
var CryptoTokenSchema = new mongoose.Schema({
    crypto_token_name: { type: String, required: true },
    crypto_token: { type: String, required: true, unique: true },
    reported_times: { type: Number, required: true, default: 0 },
    transaction_times: { type: Number, required: true, default: 0 },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})

module.exports = mongoose.model("Crypto", CryptoTokenSchema)
