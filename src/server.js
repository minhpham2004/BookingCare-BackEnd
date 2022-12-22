import express from "express"
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web"
import connectDB from "./config/connectDB";
import cors from 'cors'
require('dotenv').config();

const app = express();
app.use(cors({ origin: true }))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

configViewEngine(app)
initWebRoutes(app)

connectDB()

let port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})