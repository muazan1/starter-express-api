const mongoose = require('mongoose')

// Schema for CryptoTokens
var UserSchema = new mongoose.Schema({
    googleId: { type: String, required: false },
    githubId: { type: String, required: false },
    imageUrl: { type: String, required: false },
    secret: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, default: 0 },
    verified: { type: Boolean, required: true, default: 0 },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})

module.exports = mongoose.model("User", UserSchema)
