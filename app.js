const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const SOCKET_LIST = {};

app.get('/', (req, res) => {
	// forward the root over to client/index.html
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

io.sockets.on('connection', socket => {
	console.log('New user!');
	SOCKET_LIST[socket.id] = socket;

	// when a message is sent, send that message to everyone else
	socket.on('sendMsgToServer', data => {
		console.log('Someone sent a message!');
		for (var i = SOCKET_LIST.length - 1; i >= 0; i--) {
			SOCKET_LIST[i].emit('addToChat', data);
		}
	});

	// when disconnected, remove the reference
	socket.on('disconnect', () => {
		delete SOCKET_LIST[socket.id];
	});
});

server.listen(4141);

console.log('Server started at http://localhost:4141/');