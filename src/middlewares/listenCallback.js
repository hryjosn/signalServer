const open = require('open')
const listenCallback = (serverPort) => {
  console.log('server up and running at %s port', serverPort)
  if (process.env.LOCAL) {
    open('https://localhost:' + serverPort)
  }
}

module.exports = listenCallback