const express = require('express')
const Router = express.Router()
// const passport = require('passport');
// var GitHubStrategy = require('passport-github').Strategy;

// const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;

// const GoogleStrategy = require('passport-google-oauth20').Strategy

// const { Octokit, App } = require("octokit");
// const createAppAuth = require('@octokit/auth-app')
// import { createAppAuth } from "@octokit/auth-app";


const User = require('../models/user')

const IsAuth = require('../middleware/IsAuth')


Router.get('/user', IsAuth, async (req, res) => {

    res.status(200).json({ user: req.user })

})
Router.get('/check', IsAuth, async (req, res) => {

    res.status(200).json({ message: 'You are Logged In', user: req.user })

})

// Logout User
Router.delete('/logout', IsAuth, async (req, res) => {
    console.log(req.session)

    if (req.session) {
        req.session.destroy();
    }
    // logged out
    console.log(req.session)

    return res.status(200).json({ message: "Logged Out" })
})

// Router.post('/github/login', async (req, res, next) => {

//     console.log(req.body)

//     // res.json({ message: 'Good' })
//     // const user = passport.use(new GitHubStrategy({
//     //     clientID: '2d8be5690789685e4d2f',
//     //     clientSecret: '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',
//     //     callbackURL: "http://localhost:3000"
//     // },
//     //     (accessToken, refreshToken, profile, done) => {
//     //         console.log(profile)
//     //         // User.findOrCreate({ githubId: profile.id }, function (err, user) {
//     //         //     return cb(err, user);
//     //         // });

//     //         return done(null, profile);
//     //     }
//     // ));


//     // passport.serializeUser(function (user, done) {
//     //     done(null, user);
//     // });


//     // passport.deserializeUser(function (user, done) {
//     //     done(null, user);
//     // });


//     // passport.use(new GitHubStrategy({
//     //     clientID: "2d8be5690789685e4d2f",
//     //     clientSecret: "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",
//     //     callbackURL: "http://localhost:8080/api/v1/auth/github/login"
//     // },
//     //     function (accessToken, refreshToken, profile, done) {
//     //         return done(null, profile);
//     //     }
//     // ));


//     const GITHUB_CLIENT_ID = '2d8be5690789685e4d2f'
//     const GITHUB_CLIENT_SECRET = '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'
//     const CALL_BACK = 'http://localhost:8080/api/v1/auth/github/login'

//     const Strat = await new GitHubStrategy({
//         clientID: GITHUB_CLIENT_ID,
//         clientSecret: GITHUB_CLIENT_SECRET,
//         callbackURL: CALL_BACK
//     },
//         function (accessToken, refreshToken, profile, done) {

//             console.log('Muazan')
//             User.findOrCreate({ githubId: profile.id }, function (err, user) {
//                 return done(err, user);
//             });
//         }
//     );

//     passport.use(Strat);





//     res.send('Good')



//     // const octokit = new Octokit({
//     //     authStrategy: createAppAuth,
//     //     auth: {
//     //         appId: 1,
//     //         privateKey: "-----BEGIN PRIVATE KEY-----\n...",
//     //         installationId: 123,
//     //     },
//     // });

//     // const octokit = new Octokit({
//     //     auth: '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'
//     // })


//     // console.log(octokit)

//     // const response = await octokit.request('GET /users', {})

//     // console.log(response)


//     // const auth = createTokenAuth(req.body.code);
//     // const { token } = await auth();

//     // console.log(token)
// })


// Router.get('/github/success', async (req, res, next) => {
//     console.log(req)

//     console.log('Good HOgya Jee')
// })


// passport.authenticate('github', { scope: ['user:email'] }));


// Router.get('/github/login', () => {
//     console.log('Inside Callback')
// }
// );


// Router.post('/google/login', async (req, res, next) => {

// console.log('Google Login')

// passport.use(User.createStrategy());

// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });
// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });
// passport.use(new GoogleStrategy({
//     clientID: '366353348134-nmdsb67f9pknp4lmcnb30h27ub53aate.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: "http://localhost:8080/auth/google/callback",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
// },
//     function (accessToken, refreshToken, profile, cb) {
//         User.findOrCreate({ googleId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });
//     }
// ));


// res.send(
//     'Google'
// )

// });

module.exports = Router