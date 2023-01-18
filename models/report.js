const mongoose = require('mongoose')
// User Schema
const ReportSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    scam_type: { type: String, required: true },
    bcp_address: { type: String, required: true },
    description: { type: String, required: true },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})

// User model
const Report = mongoose.model("Report", ReportSchema)
module.exports = Report
