const mongoose = require('mongoose')

// Schema for Newsletter
var NewletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})


module.exports = mongoose.model("NewsLetter", NewletterSchema)