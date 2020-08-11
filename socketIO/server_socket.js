const {ChatModel} = require('../db/models')

module.exports = (server) => {
    const io = require('socket.io')(server)

    io.on('connection', socket => {
        console.log('socket connected')
        socket.on('sendMsg', ({from, to, content}) => {
            console.log('服务端接收消息: ', {from, to, content})
            // 处理数据(保存消息)
            // 准备chatMsg对象的相关数据
            const chat_id = [from, to].sort().join('_')
            const create_time = Date.now()
            new ChatModel({chat_id, from, to, content, create_time}).save((err, chatMsg) => {
                // 向客户端发送消息(发给所有人, 有待优化)
                io.emit('receiveMsg', chatMsg)
                console.log('服务端发送消息: ', chatMsg)
            })
        })
    })
}