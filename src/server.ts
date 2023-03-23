import { config } from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

config()
const app = express()

const mongoConnectionString = process.env.MONGO_CONNECTED_STRING

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
app.use(express.json())

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})
