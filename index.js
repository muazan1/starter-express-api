// const express = require('express')
// const app = express()

// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('Yo!')
// })

// app.listen(process.env.APP_LISTEN_PORT || 3000)


require('dotenv').config()
console.log('App is Running')
require('./database/connection')

const express = require('express')
const app = express()
const port = process.env.APP_LISTEN_PORT || 3333

// const cors = require('cors')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json());

// for routes
const Routes = require('./routes/index');
const ReportRoutes = require('./routes/reports/index');
const TokenRoutes = require('./routes/crypto/index');
const NewsLetterRoutes = require('./routes/newsletter/index');

app.use('/', Routes)
app.use(`${process.env.API_URL}/reports`, ReportRoutes)
app.use(`${process.env.API_URL}/crypto_tokens`, TokenRoutes)
app.use(`${process.env.API_URL}/news-letters`, NewsLetterRoutes)

const cors = require('cors');

app.use(cors({
    origin: 'http://127.0.0.1:3000',
    methods: ["GET", 'POST']
}));


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})