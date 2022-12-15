import express from 'express'

const configViewEngine = (app) => {
    app.use(express.static("./src/public"))

    app.set("views", './src/views')
    app.set("views engine", "ejs");
}

export default configViewEngine