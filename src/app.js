const express = require('express')
const fs = require('fs')
const https = require('https')
const http = require('http')

const getCallback = require('./middlewares/getCallback')
const listenCallback = require('./middlewares/listenCallback')

const app = express()
const options = {
  //key: fs.readFileSync('./fake-keys/privatekey.pem'),
  //cert: fs.readFileSync('./fake-keys/certificate.pem'),
}

let server
if (process.env.LOCAL) {
  server = https.createServer(options, app)
} else {
  server = http.createServer(app)
}
const io = require('socket.io')(server)
const ioObject = require('./middlewares/ioCallback')(io)
const serverPort = (process.env.PORT || 4443)

app.use(express.static(__dirname + '../test'))
app.get('/', getCallback)
io.on('connection', ioObject.ioCallback)

server.listen(serverPort, listenCallback(serverPort))