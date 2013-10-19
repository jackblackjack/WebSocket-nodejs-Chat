function SimpleSocket(httpServer, onRequest, onMessage, onClose){

	this.connection = null;
	this.clients = [];

	var webSocketServer = require('websocket').server;
	var wsServer = new webSocketServer({
		// WebSocket needs the http server for the handshake
		httpServer: httpServer
	});

	wsServer.on('request', function(request) {
		console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

		// accept connection - you should check 'request.origin' to make sure that
		// client is connecting from your website
		// (http://en.wikipedia.org/wiki/Same_origin_policy)
		this.connection = request.accept(null, request.origin);
		// we need to know client index to remove them on 'close' event
		var index = this.clients.push(this.connection) - 1;
		var userName = false;

		console.log((new Date()) + ' Connection accepted.');
		if(onRequest){
			onRequest();
		}
		// user sent some message
		this.connection.on('message', function(message) {
			if (message.type === 'utf8') { // accept only text

				if(onMessage){
					onMessage(message);
				}
			}
		});

		// user disconnected
		this.connection.on('close', function(connection) {
			if (userName !== false) {
				console.log((new Date()) + " Peer "
					+ connection.remoteAddress + " disconnected.");
				// remove user from the list of connected clients
				this.clients.splice(index, 1);
			}
		});

	});
}