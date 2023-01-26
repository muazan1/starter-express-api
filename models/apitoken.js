const mongoose = require('mongoose')

// Schema for Reports
var ApitokenSchema = new mongoose.Schema({
    user_id: [{ type: mongoose.Types.ObjectId, ref: "User", unique: true }],
    token_name: { type: String, required: true },
    token: { type: String, required: true },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})


module.exports = mongoose.model("Apitoken", ApitokenSchema)
