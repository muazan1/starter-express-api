const mongoose = require('mongoose')

// Schema for CryptoTokens
var AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: 0 },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})

module.exports = mongoose.model("Admin", AdminSchema)
