var SimpleChat = {
	content: $('#content'),
	input: $('#input'),
	inputLabel: $('.chatLabel'),
	myName: false,

	/**
	 * Shows the given message in the chronicle
	 * @param message
	 */
	showMessage: function(message){
		var dt = new Date(message.created);
		var timeStamp = (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
						+ (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes());
		SimpleChat.content.prepend('<p>'+ timeStamp + ' ' + message.author +': ' + message.content + '</p>');
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

			if (SimpleChat.myName === false) {
				SimpleChat.myName = message;
			}
			return false;
		});
	},

	Socket: {
		provider: null,
		established: function(){
			console.log('connection established');
			SimpleChat.input.removeAttr('disabled');
			SimpleChat.inputLabel.text('Choose your nick:');
		},
		error: function(error){
			SimpleChat.content.html($('<p>', { text: 'Sorry but there are connection problems' } ));
		},
		message: function(message){
			// probably the message is damaged
			try {
				var json = JSON.parse(message.data);
			} catch (e) {
				console.log('Message should be JSON! Given: ', message.data);
				return;
			}
			switch (json.type){
				case 'settings':
					SimpleChat.inputLabel.text(SimpleChat.myName + ': ');
					SimpleChat.input.removeAttr('disabled').focus();
					break;
				case 'chronicle':
					$.each(json.body, function( key, message ) {
						SimpleChat.showMessage(message);
					});
					break;
				case 'message':
					SimpleChat.input.removeAttr('disabled');
					SimpleChat.showMessage(json.body);
					break;
				default:
					console.log('Unknown message type: ', json);
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
			}
		}, ChatServer.timeout);
		// create a new socket and assign the Chat's methods as callback methods
		SimpleChat.Socket.provider = new SimpleSocket(ChatServer.host, ChatServer.port, SimpleChat.Socket.established, SimpleChat.Socket.error, SimpleChat.Socket.message);
	}
}