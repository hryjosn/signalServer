  module.exports = (io) => {
    function ioCallback(socket) {
      console.log(`Socket id: ${socket.id}`)
      socket.on('join', (roomID, callback) => {
        console.log('join', roomID)
        const socketIds = socketIdsInRoom(roomID)
        console.log(socketIds)
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
          // let currentSocket = io.sockets.connected[socketId]
          if (io.sockets.connected[socketId]) {
            io.sockets.connected[socketId].conn.close()
          }

        })
      })
      socket.on('checkRoomIsEmpty', (roomID, callBack) => {
        console.log('checkRoomIsEmpty')
        const socketIds = socketIdsInRoom(roomID)
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

    function socketIdsInRoom(roomID) {
      const socketIds = io.nsps['/'].adapter.rooms[roomID]

      if (socketIds) {
        const collection = []
        for (const key in socketIds) {
          collection.push(key)
        }
        return collection
      } else {
        return []
      }
    }

    return { ioCallback }
  }