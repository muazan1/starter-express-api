// export const googleOauthHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     // Get the code from the query
//     const code = req.query.code as string
//     const pathUrl = (req.query.state as string) || '/'

//     if (!code) {
//       return next(new AppError('Authorization code not provided!', 401))
//     }

//     // Use the code to get the id and access tokens
//     const { id_token, access_token } = await getGoogleOauthToken({ code })

//     // Use the token to get the User
//     const { name, verified_email, email, picture } = await getGoogleUser({
//       id_token,
//       access_token,
//     })

//     // Check if user is verified
//     if (!verified_email) {
//       return next(new AppError('Google account not verified', 403))
//     }

//     // Update user if user already exist or create new user
//     const user = await findAndUpdateUser(
//       { email },
//       {
//         name,
//         photo: picture,
//         email,
//         provider: 'Google',
//         verified: true,
//       },
//       { upsert: true, runValidators: false, new: true, lean: true },
//     )

//     if (!user)
//       return res.redirect(`${config.get<string>('origin')}/oauth/error`)

//     // Create access and refresh token
//     const { access_token: accessToken, refresh_token } = await signToken(user)

//     // Send cookie
//     res.cookie('refresh-token', refresh_token, refreshTokenCookieOptions)
//     res.cookie('access-token', accessToken, accessTokenCookieOptions)
//     res.cookie('logged_in', true, {
//       expires: new Date(
//         Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000,
//       ),
//     })

//     res.redirect(`${config.get<string>('origin')}${pathUrl}`)
//   } catch (err) {
//     console.log('Failed to authorize Google User', err)
//     return res.redirect(`${config.get<string>('origin')}/oauth/error`)
//   }
// }
