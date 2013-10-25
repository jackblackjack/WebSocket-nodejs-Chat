"use strict";

process.title = 'node-simplechat';

/**
 * For logging
 */
var winston = require('winston');
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: __dirname + '/'+ ChatServer.logfile })
	]
});

/**
 * Static http server serves the files(e. g. index.html)
 */
var express = require('express');
var app = express();
app.configure(function(){
    // test express server functionality
    app.use(function(req, res, next) {
        res.setHeader("Server", "Matze/0.0.1a");
        if (!res.getHeader('Cache-Control') || !res.getHeader('Expires')) {
            res.setHeader("Cache-Control", "public, max-age=345600"); // ex. 4 days in seconds.
            res.setHeader("Expires", new Date(Date.now() + 345600000).toUTCString());  // in ms.
        }
        return next();
    });
    app.use(express.static(__dirname + '/webapp'));

});
app.listen(ChatServer.httpPort);


/**
 * Http server is only needed for webSocket handshake
 */
var http = require('http');
var httpServer = http.createServer(function(request, response) { });
httpServer.listen(ChatServer.socketPort, function() {
	logger.log('info', "Server is listening on port " + ChatServer.socketPort);
});

/**
 * Initialize the WebSocketServer
 */
WebSocketServer.init(httpServer, SimpleChatServer.request, SimpleChatServer.message, SimpleChatServer.close);

