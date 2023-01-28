const mongoose = require('mongoose')

// Schema for Reports
var SettingSchema = new mongoose.Schema({
    key: { type: String },
    value: [{ type: String }],
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
})


module.exports = mongoose.model("Setting", SettingSchema)
