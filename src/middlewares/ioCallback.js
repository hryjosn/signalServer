module.exports = (io) => {
  function ioCallback(socket) {
    console.log(`Socket id: ${socket.id}`)
    socket.on('join', async (roomID, callback) => {
      console.log('join', roomID)
      const socketIds = await socketIdsInRoom(roomID)
      callback(socketIds)
      socket.join(roomID)
      socket.room = roomID
    })

    socket.on('exchange', data => {
      console.log('exchange', data.to)
      data.from = socket.id
      const to = io.sockets.connected[data.to]
      to.emit('exchange', data)
    })
    socket.on('declineCalling', roomID => {
      console.log('declineCalling')
      io.in(roomID).emit('leave')
      socketIdsInRoom(roomID).forEach(socketId => {
        if (io.sockets.connected[socketId]) {
          io.sockets.connected[socketId].conn.close()
        }

      })
    })
    socket.on('checkRoomIsEmpty', async (roomID, callBack) => {
      console.log('checkRoomIsEmpty')
      const socketIds = await socketIdsInRoom(roomID)
      callBack(socketIds)
    })
    socket.on('disconnect', () => {
      console.log('disconnect')
      if (socket.room) {
        const room = socket.room
        io.to(room).emit('leave', socket.id)
        socket.leave(room)
      }
    })
  }

  const socketIdsInRoom = roomID => {
    return new Promise((resolve => {
      io.sockets.in(roomID).clients((err, clients) => {
        resolve(clients)
      })
    }))
  };

  return { ioCallback }
}
