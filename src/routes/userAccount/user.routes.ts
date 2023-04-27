import { Router } from 'express'
import lyricsFinder from 'lyrics-finder'

const userRoutes = Router()

userRoutes.get('/api/lyrics', async (req, res) => {
	try {
		const lyrics = await lyricsFinder(req.query.artist, req.query.track)
		if (!lyrics) {
			res.status(404).json({ error: 'Lyrics not found' })
		} else {
			res.status(200).json({ lyrics })
		}
	} catch (error) {
		res.status(400)
	}
})

export default userRoutes
