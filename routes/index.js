const express = require('express')
const Router = express.Router()

// checking auth
Router.get(`${process.env.API_URL}/check`, async (req, res) => {
    res.send('Working')
})

module.exports = Router