require('dotenv').config()
console.log('App is Running')
require('./database/connection')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors');

const port = process.env.APP_LISTEN_PORT || 8080

var Routes = require('./routes/index')
var ReportRoutes = require('./routes/reports')
var TokenRoutes = require('./routes/crypto')
var NewsLetterRoutes = require('./routes/newletter')



app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: '*' }))
app.options('*', cors());
app.use(helmet())


app.use('/', Routes)
app.use(`/api/v1/reports`, ReportRoutes)
app.use(`/api/v1/crypto_tokens`, TokenRoutes)
app.use(`/api/v1/news-letters`, NewsLetterRoutes)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})