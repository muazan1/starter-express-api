const express = require('express')
const Router = express.Router()

const IsAdmin = require('../middleware/IsAdmin')
const Settings = require('../models/settings')

const bodyParser = require('body-parser')
const IsAuth = require('../middleware/IsAuth')
const JsonParser = bodyParser.json()


Router.get('/generate-settings', IsAdmin, async (req, res) => {

    const payload1 = { key: "adminEmail", value: 'admin@admin.com' }
    const payload2 = { key: "scamTypes", value: ['type1', 'type2'] }

    let set1 = await new Settings(payload1)
    set1.save()

    let set2 = await new Settings(payload2)
    set2.save()

    res.send('good hogya')

})

Router.put('/adminEMail', IsAdmin, JsonParser, async (req, res) => {

    const settings = await Settings.findOneAndUpdate({ key: "adminEmail" }, { value: req.body.email })

    res.status(200).json({ message: "Email Updated" })

})

Router.get('/adminEMail', IsAdmin, async (req, res) => {

    const settings = await Settings.findOne({ key: "adminEmail" })

    res.status(200).json({ data: settings })

})


Router.put('/adminScamTypes', IsAdmin, JsonParser, async (req, res) => {

    const data = req.body.options.split(',')

    const settings = await Settings.findOneAndUpdate({ key: "scamTypes" }, { value: data })

    res.status(200).json({ message: "Scam Types Updated" })

})

Router.get('/adminScamTypes', async (req, res) => {

    const settings = await Settings.findOne({ key: "scamTypes" })

    res.status(200).json({ data: settings })

})

module.exports = Router