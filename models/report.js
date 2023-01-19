const mongoose = require('mongoose')

var ReportSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    scam_type: { type: String, required: true },
    bcp_address: { type: String, required: true },
    description: { type: String, required: true },
    token: [{ type: mongoose.Types.ObjectId, ref: "Crypto" },],
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})


module.exports = mongoose.model("Report", ReportSchema)
