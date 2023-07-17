import { Router } from 'express'
import SpotifyWebApi from 'spotify-web-api-node'

const userAccountRouter = Router()

userAccountRouter.post('/api/code', (req, res) => {
	try {
		const { code } = req.body
		res.cookie('Code', code, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
		})
		res.status(200).json({ message: 'Login succeed' })
	}  catch (error) {
		res.status(500).json({ message: error.message })
	}
})

userAccountRouter.post('/api/login', (req, res) => {
	try {
		const code  = req.cookies.Code
		if (!code) {
			res.status(400)
		}
		const { ORIGIN, CLIENT_ID, CLIENT_SECRET } = process.env

		const spotifyApi = new SpotifyWebApi({
			redirectUri: ORIGIN,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
		})
		spotifyApi
			.authorizationCodeGrant(code)
			.then((data) => {
				res.cookie('AuthToken', data.body.access_token, {
					maxAge: 3600 * 1000,
					httpOnly: true,
					secure: true,
					sameSite: 'none',
				})
				res.cookie('RefreshToken', data.body.refresh_token, {
					httpOnly: true,
					secure: true,
					sameSite: 'none',
				})
				res.status(200).json({ message: 'Login succeed' })
			})
			.catch((error) => {
				res.status(400).json({ message: error.message })
			})
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

userAccountRouter.post('/api/logout', async (req, res) => {
	try {
		res.clearCookie('AuthToken', {
			httpOnly: true,
		})
		res.status(200).send({ message: 'Logout!' })
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
})

userAccountRouter.get('/api/get-cookie', (req, res) => {
	if (!req.cookies.AuthToken) {
		try {
			if (req.cookies.RefreshToken) {
				const refreshToken = req.cookies.RefreshToken
				const { ORIGIN, CLIENT_ID, CLIENT_SECRET } = process.env
				const spotifyApi = new SpotifyWebApi({
					redirectUri: ORIGIN,
					clientId: CLIENT_ID,
					clientSecret: CLIENT_SECRET,
					refreshToken,
				})
				spotifyApi.refreshAccessToken().then((data) => {
					res.cookie('AuthToken', data.body.access_token, {
						maxAge: 3600 * 1000,
						httpOnly: true,
						secure: true,
						sameSite: 'none',
					})
					res
						.json({
							accessToken: data.body.access_token,
							expires: 3600,
						})
						.status(200)
				})
			} else {
				res.status(401).json({ message: 'Refresh token is required' })
			}
		} catch (error) {
			res.status(400).json({ message: error.message })
		}
	} else {
		try {
			res
				.json({
					accessToken: req.cookies.AuthToken,
					refreshToken: req.cookies.RefreshToken,
					expires: +req.cookies.ExpiresIn,
				})
				.status(200)
		} catch (error) {
			res.status(500).json({ message: error.message })
		}
	}
})

export default userAccountRouter
