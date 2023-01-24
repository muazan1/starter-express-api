const express = require('express')
const Router = express.Router()


const { OAuth2Client } = require('google-auth-library');
const http = require('http');
const url = require('url');
const open = require('open');
const destroyer = require('server-destroy');
const keys = require('../client_secret_366353348134-nmdsb67f9pknp4lmcnb30h27ub53aate.apps.googleusercontent.com.json');



Router.get('/', (req, res) => {
    res.send('App is Wokring')
});


Router.get('/fail', (req, res) => {
    res.send('Login Fail')
});

// checking auth
Router.get(`${process.env.API_URL}/check`, async (req, res) => {
    res.send('Working')
})



// Router.get('/api/sessions/oauth/google', async (req, res, next) => {

//     try {

//         console.log('Inside Backend')
//         console.log(req.query)
//         console.log('Inside Backend')

//         const code = req.query.code

//         const pathUrl = req.query.state || '/'

//         const oAuth2Client = await getAuthenticatedClient();
//         // Make a simple request to the People API using our pre-authenticated client. The `request()` method
//         // takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
//         const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
//         const res = await oAuth2Client.request({ url });
//         console.log(res.data);

//         // After acquiring an access_token, you may want to check on the audience, expiration,
//         // or original scopes requested.  You can do that with the `getTokenInfo` method.
//         const tokenInfo = await oAuth2Client.getTokenInfo(
//             oAuth2Client.credentials.access_token
//         );
//         console.log(tokenInfo);





// if (!code) {
//     return next(new AppError('Authorization code not provided!', 401));
// }

// // Use the code to get the id and access tokens
// const { id_token, access_token } = await getGoogleOauthToken({ code });

// // Use the token to get the User
// const { name, verified_email, email, picture } = await getGoogleUser({
//     id_token,
//     access_token,
// });


// // Check if user is verified
// if (!verified_email) {
//     return next(new AppError('Google account not verified', 403));
// }


// const user = await findAndUpdateUser(
//     { email },
//     {
//         name,
//         photo: picture,
//         email,
//         provider: 'Google',
//         verified: true,
//     },
//     { upsert: true, runValidators: false, new: true, lean: true }
// );

// if (!user)
//     return res.redirect(`${config.get < string > ('origin')}/oauth/error`);

// // Create access and refresh token
// const { access_token: accessToken, refresh_token } = await signToken(user);
// // Send cookie
// res.cookie('refresh-token', refresh_token, refreshTokenCookieOptions);
// res.cookie('access-token', accessToken, accessTokenCookieOptions);
// res.cookie('logged_in', true, {
//     expires: new Date(
//         Date.now() + config.get < number > ('accessTokenExpiresIn') * 60 * 1000
//     ),
// });

// res.redirect(`${config.get < string > ('origin')}${pathUrl}`);

//     }
//     catch (error) { console.log(error) }

// })


// function getAuthenticatedClient() {
//     return new Promise((resolve, reject) => {
//         console.log('Muazan')
//         console.log(resolve)
//         console.log(reject)

//         // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
//         // which should be downloaded from the Google Developers Console.
//         const oAuth2Client = new OAuth2Client(
//             keys.web.client_id,
//             keys.web.client_secret,
//             keys.web.redirect_uris[0]
//         );

//         console.log('oAuth2Client')
//         console.log(oAuth2Client)

//         // Generate the url that will be used for the consent dialog.
//         const authorizeUrl = oAuth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: 'https://www.googleapis.com/auth/userinfo.profile',
//         });

//         console.log('authorizeUrl')
//         console.log(authorizeUrl)

//         // Open an http server to accept the oauth callback. In this simple example, the
//         // only request to our webserver is to /oauth2callback?code=<code>
//         const server = http
//             .createServer(async (req, res) => {
//                 try {
//                     console.log('req.url')
//                     console.log(req.url)
//                     if (req.url.indexOf('/oauth2callback') > -1) {
//                         // acquire the code from the querystring, and close the web server.
//                         const qs = new url.URL(req.url, 'http://localhost:8080')
//                             .searchParams;
//                         const code = qs.get('code');
//                         console.log(`Code is ${code}`);
//                         res.end('Authentication successful! Please return to the console.');
//                         server.destroy();

//                         // Now that we have the code, use that to acquire tokens.
//                         const r = await oAuth2Client.getToken(code);
//                         // Make sure to set the credentials on the OAuth2 client.
//                         oAuth2Client.setCredentials(r.tokens);
//                         console.info('Tokens acquired.');
//                         resolve(oAuth2Client);
//                     }
//                 } catch (e) {
//                     console.log('rejection')
//                     console.log(e)
//                     reject(e);
//                 }

//                 console.log('created')
//             })
//             .listen(8082, () => {
//                 // open the browser to the authorize url to start the workflow
//                 open(authorizeUrl, { wait: false }).then(cp => cp.unref());
//             });
//         destroyer(server);
//     });
// }


module.exports = Router