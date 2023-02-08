const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
console.clear()

mongoose.set('strictQuery', false)
mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Connected To DB')
}).catch(e => {
    console.log(e + '')
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const Router = require('./Routes/indexRouter')
app.use(Router)

const {ErrorMiddleware} = require("./Middlewares/ErrorMiddleware");
app.use(ErrorMiddleware)

app.listen(PORT, () => {
    console.log(`Server has been started on port 🚀${PORT}`)
})