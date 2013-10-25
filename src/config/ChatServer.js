/**
 *
 * @type {{host: string, httpPort: number, socketPort: number, path: string, timeout: number, logfile: string}}
 */
var ChatServer = {
	host: 'wittem.puppis.uberspace.de',

    // Port of the nodejs http server
    httpPort: 61832,

    // Port of the nodejs socket server
    socketPort: 61457,

    // Path to the nodejs socket server
	path: '',

    // Timeout for socket server
	timeout: 5000,

    // Name of the logfile relative to the nodejs app
    logfile: 'chat.log'
}

// Overwrite for local setup
var ChatServer = {
    host: 'localhost',
    httpPort: 3000,
    socketPort: 61457,
    path: '',
    timeout: 5000,
    logfile: 'chat.log'
}