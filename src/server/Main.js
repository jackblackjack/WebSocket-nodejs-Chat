// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";


// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-simplechat';

// Port where we'll run the websocket server
var webSocketsServerPort = 61843;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
// latest 100 messages
var chronicle = [ ];
// list of currently connected clients (users)
var clients = [ ];

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * HTTP server
 */
var httpServer = http.createServer(function(request, response) {
	// useless so far, we it only for the webSocket
});
httpServer.listen(webSocketsServerPort, function() {
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
	// WebSocket server is tied to a HTTP server. WebSocket request is just
	// an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
	httpServer: httpServer
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

	// accept connection - you should check 'request.origin' to make sure that
	// client is connecting from your website
	// (http://en.wikipedia.org/wiki/Same_origin_policy)
	var connection = request.accept(null, request.origin);
	// we need to know client index to remove them on 'close' event
	var index = clients.push(connection) - 1;
	var userName = false;

	console.log((new Date()) + ' Connection accepted.');

	// send back chat chronicle
	if (chronicle.length > 0) {
		connection.sendUTF(JSON.stringify( { type: 'chronicle', body: chronicle} ));
	}

	// user sent some message
	connection.on('message', function(message) {
		if (message.type === 'utf8') { // accept only text
			if (userName === false) { // first message sent by user is their name
				// remember user name
				userName = htmlEntities(message.utf8Data);
				connection.sendUTF(JSON.stringify({ type:'settings', body: {}}));
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
				for (var i=0; i < clients.length; i++) {
					clients[i].sendUTF(json);
				}
			}
		}
	});

	// user disconnected
	connection.on('close', function(connection) {
		if (userName !== false) {
			console.log((new Date()) + " Peer "
				+ connection.remoteAddress + " disconnected.");
			// remove user from the list of connected clients
			clients.splice(index, 1);
		}
	});

});