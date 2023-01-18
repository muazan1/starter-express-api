require('dotenv').config()
console.log('App is Running')
require('./database/connection')

const express = require('express')
const app = express()
const port = process.env.APP_LISTEN_PORT || 8080
const bodyParser = require('body-parser')

var Routes = require('./routes/index')
// var ReportRoutes = require('./routes/reports/index')
// var TokenRoutes = require('./routes/crypto/index')
// var NewsLetterRoutes = require('./routes/newsletter/index')

console.log('Routes')
app.use('/', Routes)
// console.log('ReportRoutes')
// app.use(`${process.env.API_URL}/reports`, ReportRoutes)
// console.log('TokenRoutes')
// app.use(`${process.env.API_URL}/crypto_tokens`, TokenRoutes)
// console.log('NewsLetterRoutes')
// app.use(`${process.env.API_URL}/news-letters`, NewsLetterRoutes)

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