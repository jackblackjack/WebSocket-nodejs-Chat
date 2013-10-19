var WebSocketServer = {
	/**
	 * contains the connected clients
	 */
	clients: {},

	/**
	 * Initialize the WebSocketServer
	 *
	 * @param httpServer needed for webSocket handshake
	 * @param onRequest callback
	 * @param onMessage callback
	 * @param onClose callback
	 */
	init: function(httpServer, onRequest, onMessage, onClose){
		var webSocketServer = require('websocket').server;
		var wsServer = new webSocketServer({
			// WebSocket needs the http server for the handshake
			httpServer: httpServer
		});

		/**
		 * on Request
		 */
		wsServer.on('request', function(request) {
			console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
			// @TODO check connection is from same origin request.origin
			var connection = request.accept(null, request.origin);
			var client = {
				connection: connection,
				settings: {}
			}
			// save client's index for removing on disconnect
			var clientIndex = Object.keys(WebSocketServer.clients).length;
			WebSocketServer.clients[clientIndex] = client;

			console.log((new Date()) + ' Connection accepted with index ' + clientIndex);
			if(onRequest){
				onRequest(client);
			}

			/**
			 * Client sent message
			 */
			client.connection.on('message', function(message) {
				if (message.type === 'utf8') { // accept only text
					if(onMessage){
						onMessage(message, client);
					}
				}
			});

			/**
			 * Client disconnected
			 */
			client.connection.on('close', function(connection) {
				console.log((new Date()) + " Client " + client.connection.remoteAddress + " disconnected.");
				// remove user from the list of connected clients
				delete WebSocketServer.clients[clientIndex];
				if(onClose){
					onClose(client);
				}
			});
		});
	},

	/**
	 * Sends a message to all connected clients
	 * @param message
	 */
	broadcast: function(message){
		// iterate over existing clients
		Object.keys(WebSocketServer.clients).forEach(function(index) {
			WebSocketServer.send(WebSocketServer.clients[index], message)
		});
	},

	/**
	 * Sends a message to a specific client
	 *
	 * @param client
	 * @param message
	 */
	send: function(client, message){
		client.connection.sendUTF(JSON.stringify(message));
	}
}