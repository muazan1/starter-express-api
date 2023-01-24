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
    clientID: '2d8be5690789685e4d2f',
    clientSecret: '01082dafede7ec0ab1791affa0e1126f0f0fc9cd',
    callbackURL: "http://localhost:8080/auth/github/callback"
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
            name: profile.displayName,
            email: profile.username + '@wisesama.com',
            password: hashedPassword,
            verified: true,
        }

        const newUser = await User.create(payloadData);

        return newUser;


    }

}


