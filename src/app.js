const express = require('express')
const fs = require('fs')
const https = require('https')
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
  const master = "webRTC-signal-sever-key";
  if (master === process.env.MASTER_KEY) {
    ioObject.ioCallback(io)
  } else {
    console.log('Unauthenticated')
  }
})

server.listen(serverPort, listenCallback(serverPort))
