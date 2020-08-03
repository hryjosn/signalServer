module.exports = (io) => {
    function ioCallback(socket) {
        socket.on('join', async (roomID, callback) => {
            // when the client join the room by roomId
            const socketIds = await socketIdsInRoom(roomID)
            callback(socketIds)
            socket.join(roomID)
            socket.room = roomID
        })
        socket.on('exchange', data => {
            //exchange the clients' data (include session description protocol and ice candidate information
            data.from = socket.id;
            const to = io.sockets.connected[data.to]
            to.emit('exchange', data)
        })
        socket.on('declineCalling', async roomID => {
            //when client refuse or decline the call
            io.in(roomID).emit('leave')
            //trigger the leave from client side's socket event
            const socketIds = await socketIdsInRoom(roomID)
            socketIds.forEach(socketId => {
                //force to disconnect the socket in the room
                if (io.sockets.connected[socketId]) {
                    io.sockets.connected[socketId].conn.close()
                }
            })
        })

        socket.on('disconnect', () => {
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
