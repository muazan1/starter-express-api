const mongoose = require('mongoose')

var ReportSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    scam_type: { type: String, required: true },
    bcp_address: { type: String, required: true },
    description: { type: String, required: true },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})


var Report = mongoose.model("Report", ReportSchema)
module.exports = Report
