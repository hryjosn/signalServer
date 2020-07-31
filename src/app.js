const express = require('express')
const http = require('http')
const path = require('path')
require('dotenv').config()

const getCallback = require('./middlewares/getCallback')
const listenCallback = require('./middlewares/listenCallback')

const app = express()

let server
server = http.createServer(app)
const io = require('socket.io')(server)
const ioObject = require('./middlewares/ioCallback')(io)
const serverPort = (process.env.PORT || 80)
app.use(express.static(path.join(__dirname, '../test')))
app.get('/', getCallback)
io.on('connection', (io) => {
  ioObject.ioCallback(io)

})

server.listen(serverPort, listenCallback(serverPort))
