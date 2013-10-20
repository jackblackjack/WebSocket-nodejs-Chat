"use strict";

process.title = 'node-simplechat';

var webSocketsServerPort = 61843;
var http = require('http');

// http server
var httpServer = http.createServer(function(request, response) {
	// useless so far, we need it only for the webSocket
});
httpServer.listen(webSocketsServerPort, function() {
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

WebSocketServer.init(httpServer, SimpleChatServer.request, SimpleChatServer.message, SimpleChatServer.close);

