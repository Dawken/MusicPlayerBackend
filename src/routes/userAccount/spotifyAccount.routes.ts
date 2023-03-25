import { Router } from 'express'
import SpotifyWebApi from 'spotify-web-api-node'

const userAccountRouter = Router()

userAccountRouter.post('/api/login', (req, res) => {
	const { ORIGIN, CLIENT_ID, CLIENT_SECRET } = process.env
	const code = req.body.code
	const spotifyApi = new SpotifyWebApi({
		redirectUri: ORIGIN,
		clientId: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
	})
	spotifyApi
		.authorizationCodeGrant(code)
		.then((data) => {
			res.json({
				accessToken: data.body.access_token,
				refreshToken: data.body.refresh_token,
				expiresIn: data.body.expires_in,
			})
		})
		.catch(() => {
			res.status(400)
		})
})
export default userAccountRouter
