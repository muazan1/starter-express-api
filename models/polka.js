const mongoose = require('mongoose')

// Schema for CryptoTokens
var PolkaSchema = new mongoose.Schema({
    token: { type: String, required: true },
})

module.exports = mongoose.model("Polka", PolkaSchema)
