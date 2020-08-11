module.exports = (server) => {
    const io = require('socket.io')(server)

    io.on('connection', socket => {
        console.log('socket connected')
        socket.on('receiveMsg', ({from, to, data}) => {
            console.log('客户端收到消息: ' + {from, to, data})
            socket.emit('sendMsg', {from, to, data})
            console.log('客户端发送消息: ' + {from, to, data})
        })
    })
}