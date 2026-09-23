const { tunnel: cloudflaredTunnel } = require("cloudflared")
const cookieParser = require("cookie-parser")
const socketIO = require("socket.io")
const config = require("./config")
const express = require("express")
const tarkine = require("tarkine")
const http = require("http")


const app = express()

const server = http.createServer(app)

const io = new socketIO.Server(server)


const PORT = process.env.PORT || config.port



// Global variables
global.IO = io
global.remoteURL = ""



// View engine
app.set("view engine", "html")
app.engine("html", tarkine.renderFile)



// Middleware
app.use(cookieParser())

app.use(express.urlencoded({
    extended: false
}))

app.use(express.json())

app.use(express.static(
    __dirname + "/public"
))



// Routes
app.use("/", require("./router"))



// Start server
server.listen(PORT, async () => {

    const localURL = `http://localhost:${PORT}`


    global.remoteURL = await cloudflaredTunnel({
        "--url": localURL
    }).url



    console.log("--------------------------------")
    console.log("LOCAL  :", localURL)
    console.log("REMOTE :", global.remoteURL)
    console.log("--------------------------------")

})