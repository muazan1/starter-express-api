require('dotenv').config()
console.log('App is Running')
require('./database/connection')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors');
const session = require('express-session')

const googlePassport = require('./passport/google')
const githubPassport = require('./passport/github')

const port = process.env.APP_LISTEN_PORT || 8080

const passport = require('passport')

var Routes = require('./routes/index')
var ReportRoutes = require('./routes/reports')
var TokenRoutes = require('./routes/crypto')
var NewsLetterRoutes = require('./routes/newletter')
var AuthRoutes = require('./routes/auth')

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
app.use(`/api/v1/auth`, AuthRoutes)
app.use(`/api/v1/reports`, ReportRoutes)
app.use(`/api/v1/crypto_tokens`, TokenRoutes)
app.use(`/api/v1/news-letters`, NewsLetterRoutes)


const sendFront = () => {
    console.log('On Front side')
}

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        scope: ['email', 'profile'],
        failureRedirect: "/login/failed",
    }),
    function (req, res) {
        console.log(req)
        let authUser = req.user

        var X_TOKEN = jwt.sign({
            username: authUser.displayName
        }, 'nmdsb67f9pknp4lmcnb30h27ub53aate', {
            expiresIn: 86400
        });

        return res.redirect(`http://localhost:3000?token=${X_TOKEN}`);
    }
)

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login/failed' }),
    function (req, res) {
        let authUser = req.user

        var X_TOKEN = jwt.sign({
            username: authUser.displayName
        }, 'nmdsb67f9pknp4lmcnb30h27ub53aate', {
            expiresIn: 86400
        });

        return res.redirect(`http://localhost:3000?token=${X_TOKEN}`);
    }
);


app.get("/login/failed", (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure",
    });
});


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})