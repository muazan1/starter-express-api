
const passport = require('passport');

const User = require('../models/user')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken');

const GoogleStrategy = require('passport-google-oauth20').Strategy


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    // clientID: '366353348134-nmdsb67f9pknp4lmcnb30h27ub53aate.apps.googleusercontent.com',
    // clientSecret: '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',
    // callbackURL: "http://localhost:8080/auth/google/callback",
    // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    userProfileURL: process.env.GOOGLE_USER_PROFILE_URL
},
    function (accessToken, refreshToken, profile, done) {

        let CreatedUser = createOrUpdateUser(profile);

        return done(null, profile, CreatedUser);

    }
));


const createOrUpdateUser = async (profile) => {

    const data = { 'googleId': profile.id }

    const ExtUser = await User.find(data)

    if (ExtUser.length > 0) {
        console.log('User Found')
        return ExtUser
    }
    else {
        console.log('User Not Found')

        const hashedPassword = await bcrypt.hash('LaCasaDaPapel12', 10);

        const payloadData = {
            googleId: profile.id,
            githubId: '',
            secret: profile.id,
            imageUrl: profile.photos[0].value,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: hashedPassword,
            verified: true,
        }

        const newUser = await User.create(payloadData);

        return newUser;


    }

}

const authenticateUserApi = async (CreatedUser) => {

    console.log(CreatedUser)

    var token = jwt.sign({
        username: CreatedUser.name
    }, 'nmdsb67f9pknp4lmcnb30h27ub53aate', {
        expiresIn: 86400
    });

    console.log('token created')
    console.log(token)

    return token;


}