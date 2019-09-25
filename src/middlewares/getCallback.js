const getCallback = (req, res) => {
  console.log('get /')
  res.sendFile(__dirname + '/index.html')
}

module.exports = getCallback