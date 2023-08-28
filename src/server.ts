import { config } from 'dotenv'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import userAccountRouter from './routes/userAccount/spotifyAccount.routes'
import userRoutes from './routes/userAccount/user.routes'

config()
const app = express()

const localhost = process.env.ORIGIN

const corsOptions = {
	origin: localhost,
	credentials: true,
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(userAccountRouter)
app.use(userRoutes)


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`)
})
