var SimpleChat = {
	audio: document.getElementById('audio'),
	content: $('#chat .content'),
	input: $('#chat .input'),
	inputLabel: $('#chat .chatLabel'),
	clientSettings: {},
	lineEven: false,

	printChatLine: function(content, animated, classes){
		if(SimpleChat.lineEven){
			SimpleChat.lineEven = false;
			var evenClass = " even";
		}else{
			SimpleChat.lineEven = true;
			var evenClass = "";
		}
		SimpleChat.content.append('<p style="display: none;" class="'+classes + evenClass+'">'+ content + '</p>');
		if(animated){
			SimpleChat.content.children().last().fadeIn('slow');
			// scroll to the bottom of the container
			SimpleChat.content.animate({
				scrollTop: SimpleChat.content[0].scrollHeight
			}, 250);
		}else{
			SimpleChat.content.children().last().show();
			SimpleChat.content.scrollTop(SimpleChat.content[0].scrollHeight);
		}
	},

	/**
	 * Shows the given message in the chronicle
	 * @param message
	 */
	showMessage: function(message, animated){
		var dt = new Date(message.created);
		var timeStamp = (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
						+ (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes());

		var content = timeStamp + ' ' + message.author +': ' + message.content;
		SimpleChat.printChatLine(content, animated, '');
		if(animated){
			SimpleChat.audio.play();
		}
	},

	showInfo: function(info, animated){
		var dt = new Date(info.created);
		var timeStamp = (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
			+ (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes());
		var content = "";
		switch (info.type){
			case 'userLeft':
				content = 'User "' + info.content + '" has left the building';
				break;
			case 'userJoined':
				content = 'User "' + info.content + '" has joined';
				break;
		}
		content = '<span>' + content + '</span>';
		SimpleChat.printChatLine(content, animated, 'info');
	},

	/**
	 * Binds user interaction events
	 */
	bindEvents: function(){
		$('#chatform').submit(function(){
			var message = $(this).find('input').val();
			if (!message) {
				return false;
			}
			SimpleChat.Socket.send(message);
			$(this).find('input').val('');
			SimpleChat.input.attr('disabled', 'disabled');

			return false;
		});
	},

	Socket: {
		provider: null,
		established: function(){
			console.log('connection established');
			var storedClientSettings = Storage.restore('clientSettings');
			if(storedClientSettings && typeof storedClientSettings.nickname !== "undefined"){
				SimpleChat.Socket.send(storedClientSettings.nickname);
				SimpleChat.input.val('');
			}else{
				SimpleChat.inputLabel.text('Choose your nick:');
			}
			SimpleChat.input.removeAttr('disabled');
		},
		error: function(error){
			SimpleChat.content.html($('<p>', { text: 'Sorry but there are connection problems' } ));
		},
		message: function(message){
			// probably the message is damaged
			try {
				message = JSON.parse(message.data);
			} catch (e) {
				console.log('Message should be JSON! Given: ', message.data);
				return;
			}
			switch (message.type){
				case 'settings':
					SimpleChat.clientSettings = message.body;
					Storage.store('clientSettings', SimpleChat.clientSettings);
					SimpleChat.inputLabel.text(SimpleChat.clientSettings.nickname);
					SimpleChat.input.removeAttr('disabled').focus();
					break;
				case 'chronicle':
					console.log(message.body.length);
					$.each(message.body, function( key, message ) {
						SimpleChat.showMessage(message, false);
					});
					break;
				case 'message':
					SimpleChat.input.removeAttr('disabled').focus();
					SimpleChat.showMessage(message.body, true);
					break;
				case 'info':
					SimpleChat.showInfo(message.body, true);
					break;
				default:
					console.log('Unknown message type: ', message);
			}
		},
		send: function(message){
			SimpleChat.Socket.provider.send(message);
		}
	},

	init: function(){
		SimpleChat.bindEvents();
		setInterval(function() {
			if (SimpleChat.Socket.provider.getReadyState() !== 1) {
				SimpleChat.inputLabel.text('Error');
				SimpleChat.input.attr('disabled', 'disabled').val('Server is unavailable');
				// @TODO think about reconnection
				SimpleChat.Socket.provider = new SimpleSocket(ChatServer.host, ChatServer.socketPort, ChatServer.path, SimpleChat.Socket.established, SimpleChat.Socket.error, SimpleChat.Socket.message);
			}
		}, ChatServer.timeout);
		// create a new socket and assign the Chat's methods as callback methods
		SimpleChat.Socket.provider = new SimpleSocket(ChatServer.host, ChatServer.socketPort, ChatServer.path, SimpleChat.Socket.established, SimpleChat.Socket.error, SimpleChat.Socket.message);
	}
}