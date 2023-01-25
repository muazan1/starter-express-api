const axios = require('axios');

const passport = require('passport');

const User = require('../models/user')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken');

const { Octokit, App } = require("octokit");

var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK
},
    function (accessToken, refreshToken, profile, done) {
        let authUser = createOrUpdateUser(profile)

        return done(null, profile);
    }
));


const createOrUpdateUser = async (profile) => {

    const data = { 'githubId': profile.id }

    const ExtUser = await User.find(data)

    if (ExtUser.length > 0) {
        console.log('User Found')
        return ExtUser
    }
    else {
        console.log('User Not Found')

        const response = await axios.get(`https://api.github.com/users/${profile.username}/events`)

        const hashedPassword = await bcrypt.hash('LaCasaDaPapel12', 10);


        const payloadData = {
            googleId: '',
            githubId: profile.id,
            secret: profile.id,
            imageUrl: profile.photos[0].value,
            name: profile.displayName,
            email: profile.username + '@wisesama.com',
            password: hashedPassword,
            verified: true,
        }

        const newUser = await User.create(payloadData);

        return newUser;

    }

}
