const express = require('express')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const passport = require('passport')
const googlePassport = require('../passport/google')
const githubPassport = require('../passport/github')

Router.get(
    "/google/callback",
    passport.authenticate("google", {
        scope: ['email', 'profile'],
        failureRedirect: "/login/failed",
    }),
    async (req, res) => {

        let authUser = req.user

        const user = await User.find({ 'googleId': authUser.id })

        var X_TOKEN = jwt.sign({
            user: user
        }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        return res.redirect(`${process.env.FRONTEND_URL}?token=${X_TOKEN}`);
    }
)


Router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login/failed' }),
    async (req, res) => {
        let authUser = req.user

        const user = await User.find({ 'githubId': authUser.id })

        var X_TOKEN = jwt.sign({
            user: user
        }, process.env.JWT_SECRET, {
            expiresIn: 86400
        });

        return res.redirect(`${process.env.FRONTEND_URL}?token=${X_TOKEN}`);
    }
);

module.exports = Router