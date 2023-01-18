const express = require('express')
const Router = express.Router()


Router.get('/', (req, res) => {
    res.send('App is Wokring')
});
Router.get('/muazan', (req, res) => {
    res.send('Muazan')
});
// checking auth
Router.get(`${process.env.API_URL}/check`, async (req, res) => {
    res.send('Working')
})

module.exports = Router