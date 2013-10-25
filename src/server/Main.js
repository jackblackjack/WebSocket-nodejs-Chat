"use strict";

process.title = 'node-simplechat';

var winston = require('winston');
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: '/tmp/nodejs.log' })
	]
});

var webSocketsServerPort = 61457;
var http = require('http');

// http server
var httpServer = http.createServer(function(request, response) {
	// useless so far, we need it only for the webSocket
});
httpServer.listen(webSocketsServerPort, function() {
	logger.log('info', "Server is listening on port " + webSocketsServerPort);
});

WebSocketServer.init(httpServer, SimpleChatServer.request, SimpleChatServer.message, SimpleChatServer.close);

