require('dotenv').config()
console.log('App is Running')
require('./database/connection')

const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const helmet = require('helmet')

const cors = require('cors')

const session = require('express-session')

const passport = require('passport')

const googlePassport = require('./passport/google')

const githubPassport = require('./passport/github')

const port = process.env.APP_LISTEN_PORT || 8080

var Routes = require('./routes/index')

var ReportRoutes = require('./routes/reports')

var TokenRoutes = require('./routes/crypto')

var NewsLetterRoutes = require('./routes/newletter')

var AuthRoutes = require('./routes/auth')

var UserRoutes = require('./routes/user')

var SystemUserRoutes = require('./routes/systemusers')

var AuthenticationRoutes = require('./routes/authentication')

var AdminRoutes = require('./routes/admin')

var ApiTokenRoutes = require('./routes/apitoken')

var SettingsRoutes = require('./routes/settings')

const User = require('./models/user')

const { OAuth2Client } = require("google-auth-library");

const jwt = require("jsonwebtoken");

app.use(express.json());

app.use(express.urlencoded({ extended: false }))

app.use(cors({ origin: '*' }))

app.options('*', cors());

app.use(helmet());

app.use(session({
    secret: 'WisesamaApp',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(passport.initialize())



app.use('/', Routes)

app.use(`/auth`, AuthenticationRoutes)

app.use(`/api/v1/admin`, AdminRoutes)

app.use(`/api/v1/auth`, AuthRoutes)

app.use(`/api/v1/reports`, ReportRoutes)

app.use(`/api/v1/crypto_tokens`, TokenRoutes)

app.use(`/api/v1/news-letters`, NewsLetterRoutes)

app.use(`/api/v1/users`, UserRoutes)

app.use(`/api/v1/system-users`, SystemUserRoutes)

app.use('/api/v1/api-token', ApiTokenRoutes)

app.use('/api/v1/settings', SettingsRoutes)

app.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})