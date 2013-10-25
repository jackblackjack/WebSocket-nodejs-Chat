var SimpleChatServer = {
	webSocket: null,
	chronicle: [],

	/**
	 * Process a received message
	 *
	 * @param message
	 * @param client
	 */
	message: function(message, client){
		// if nickname isn't set the message is the clients nickname
		if (typeof client.settings.nickname === 'undefined') {
			// add nickname to client settings
			client.settings.nickname = SimpleChatServer.uniqueNickname(U.htmlEntities(message.utf8Data));
			WebSocketServer.send(client, { type:'settings', body: client.settings});
			var infoObject = {
				created: (new Date()).getTime(),
				type: 'userJoined',
				content: client.settings.nickname
			};
			WebSocketServer.broadcast({type: 'info', body: infoObject});
			logger.log('info', 'User is known as: ' + client.settings.nickname);
		} else {
			logger.log('info', 'Received Message from '
				+ client.settings.nickname + ': ' + message.utf8Data);
			// we want to keep chronicle of all sent messages
			var messageObject = {
				created: (new Date()).getTime(),
				author: client.settings.nickname,
				content: U.htmlEntities(message.utf8Data)
			};

			SimpleChatServer.chronicle.push(messageObject);
			SimpleChatServer.chronicle = SimpleChatServer.chronicle.slice(-50);
			// broadcast message to all connected clients
			WebSocketServer.broadcast({ type: 'message', body: messageObject });
		}
	},

	/**
	 * Gets called on first connection to the client
	 *
	 * @param client
	 */
	request: function(client){
		// send back chat chronicle
		if (Object.keys(SimpleChatServer.chronicle).length > 0) {
			WebSocketServer.send(client, { type: 'chronicle', body: SimpleChatServer.chronicle});
		}

	},

	/**
	 * Gets called when the client disconnects
	 */
	close: function(client){
		if(typeof client.settings.nickname !== 'undefined'){
			var infoObject = {
				created: (new Date()).getTime(),
				type: 'userLeft',
				content: U.htmlEntities(client.settings.nickname)
			};
			WebSocketServer.broadcast({type: 'info', body: infoObject});
		}
	},

	/**
	 * Find a unique nickname
	 *
	 * @param nickname
	 * @param increment optional
	 * @returns string
	 */
	uniqueNickname: function(nickname) {
		if (typeof increment === 'undefined') {
			var increment = 0;
		}
		var newNick = nickname;
		Object.keys(WebSocketServer.clients).forEach(function(index) {
			var otherNickname = WebSocketServer.clients[index].settings.nickname;
			if(typeof otherNickname !== 'undefined' && nickname === otherNickname){
				newNick = nickname + '' + Math.floor(Math.random()*10);
				return;
			}
		});
		return newNick;
	}
}