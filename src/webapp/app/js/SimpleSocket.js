/**
 * Wraps the browsers WebSocket functionality in a simple way
 *
 * @param host
 * @param port
 * @param onOpenCallback is called when the connection is established
 * @param onErrorCallback is called when the socket got an error
 * @param onMessageCallback is called when there comes a new message
 */
function SimpleSocket(host, port, onOpenCallback, onErrorCallback, onMessageCallback){
	window.WebSocket = window.WebSocket || window.MozWebSocket;
	// if browser does not support WebSockets
	if (!window.WebSocket) {
		alert("Browser does not support WebSockets")
		return;
	}
	var socket = new WebSocket('ws://' + host + ':' + port);
	socket.onopen = function () {
		onOpenCallback();
	};
	socket.onerror = function (error) {
		socket.close();
		onErrorCallback(error);
	};
	socket.onmessage = function (message) {
		onMessageCallback(message);
	};

	/**
	 * Send data through the socket
	 * @param message
	 */
	this.send = function(message){
		socket.send(message);
	}

	/**
	 * Gets the current readyState property
	 * @returns {number}
	 */
	this.getReadyState = function(){
		return socket.readyState;
	}
}