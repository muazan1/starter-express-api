const mongoose = require('mongoose')

// Schema for Reports
var ReportSchema = new mongoose.Schema({
    // user_id: { type: String, required: true },
    user_id: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    scam_type: { type: String, required: true },
    bcp_address: { type: String, required: true },
    description: { type: String, required: true },
    token: [{ type: mongoose.Types.ObjectId, ref: "Crypto" }],
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})


module.exports = mongoose.model("Report", ReportSchema)
