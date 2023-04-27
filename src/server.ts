import { config } from 'dotenv'
import cookieParser from 'cookie-parser'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userAccountRouter from './routes/userAccount/spotifyAccount.routes'
import userRoutes from './routes/userAccount/user.routes'

config()
const app = express()

const mongoConnectionString = process.env.MONGO_CONNECTED_STRING
const localhost = process.env.ORIGIN

const corsOptions = {
	origin: localhost,
	credentials: true,
}

mongoose.connect(mongoConnectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})

const database = mongoose.connection

database.on('error', (error) => {
	console.log(error)
})

database.once('connected', () => {
	console.log('Database Connected')
})

app.set('Access-Control-Allow-Credentials', true)
app.set('Access-Control-Allow-Origin', '*')
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use(userAccountRouter)
app.use(userRoutes)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`)
})
