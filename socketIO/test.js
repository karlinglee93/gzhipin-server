module.exports = (server) => {
	// 得到IO对象
	const io = require('socket.io')(server)
	
	// 监视连接(当有一个客户连接上时回调)
	io.on('connection', (socket) => {
		console.log('socket connected')
		// 绑定sendMsg监听, 接收客户端发送的消息
		socket.on('sendMsg', (data) => {
			console.log('服务器接收到客户端的消息', data)
			// 向客户端发送消息
			socket.emit('receiveMsg', data.name + '_' + data.date)
			console.log('服务器向客户端发送消息', data.name + '_' + data.date)
		})
	})
}