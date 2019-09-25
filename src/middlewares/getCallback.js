const path = require('path')
const getCallback = (req, res) => {
  console.log('get /')
  res.sendFile(path.join(__dirname, '../../test', 'index.html'))
}

module.exports = getCallback