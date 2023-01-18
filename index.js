require('dotenv').config()
console.log('App is Running')
require('./database/connection')

const express = require('express')
const app = express()
const port = process.env.APP_LISTEN_PORT || 8080
const bodyParser = require('body-parser')

var Routes = require('./routes/index')
var ReportRoutes = require('./routes/reports')
var TokenRoutes = require('./routes/crypto')
var NewsLetterRoutes = require('./routes/newletter')

console.log('Routes')
app.use('/', Routes)
// console.log('ReportRoutes')
app.use(`/api/v1/reports`, ReportRoutes)
// console.log('TokenRoutes')
app.use(`/api/v1/crypto_tokens`, TokenRoutes)
// console.log('NewsLetterRoutes')
app.use(`/api/v1/news-letters`, NewsLetterRoutes)

const cors = require('cors');

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://127.0.0.1:3000',
    methods: ["GET", 'POST']
}));


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})