var SimpleChatServer = {
	webSocket: null,
	chronicle: [],

	message: function(message){
		if (userName === false) { // first message sent by user is their name
			// remember user name
			userName = htmlEntities(message.utf8Data);
			this.webSocket.connection.sendUTF(JSON.stringify({ type:'settings', body: {}}));
			console.log((new Date()) + ' User is known as: ' + userName);

		} else { // log and broadcast the message
			console.log((new Date()) + ' Received Message from '
				+ userName + ': ' + message.utf8Data);

			// we want to keep chronicle of all sent messages
			var obj = {
				created: (new Date()).getTime(),
				author: userName,
				content: htmlEntities(message.utf8Data)
			};
			chronicle.push(obj);
			chronicle = chronicle.slice(-100);

			// broadcast message to all connected clients
			var json = JSON.stringify({ type:'message', body: obj });
			for (var i=0; i < this.webSocket.clients.length; i++) {
				this.webSocket.clients[i].sendUTF(json);
			}
		}
	},

	request: function(){
		// send back chat chronicle
		if (this.chronicle.length > 0) {
			this.webSocket.connection.sendUTF(JSON.stringify( { type: 'chronicle', body: this.chronicle} ));
		}

	},

	close: function(){

	},

	init: function(){

		var http = require('http');
		var webSocketsServerPort = 61843;

		/**
		 * HTTP server
		 */
		var httpServer = http.createServer(function(request, response) {
			// useless so far, we it only for the webSocket
		});
		httpServer.listen(webSocketsServerPort, function() {
			console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
		});


		this.webSocket = new WebSocketServer(httpServer, SimpleChatServer.request, SimpleChatServer.message, SimpleChatServer.close);
	}
}