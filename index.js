require('dotenv').config()
console.log('App is Running')
require('./database/connection')

const express = require('express')
const app = express()
const port = process.env.APP_LISTEN_PORT || 8080
const bodyParser = require('body-parser')
const helmet = require('helmet')

var Routes = require('./routes/index')
var ReportRoutes = require('./routes/reports')
var TokenRoutes = require('./routes/crypto')
var NewsLetterRoutes = require('./routes/newletter')

app.use('/', Routes)
app.use(`/api/v1/reports`, ReportRoutes)
app.use(`/api/v1/crypto_tokens`, TokenRoutes)
app.use(`/api/v1/news-letters`, NewsLetterRoutes)

const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    // origin: 'http://127.0.0.1:3000',
    origin: '*',
    methods: ["GET", 'POST', 'PUT']
}));
app.use(helmet())

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})