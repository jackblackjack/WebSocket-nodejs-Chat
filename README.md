WebSocket nodejs Chat
=====================
This is a single page application with a nodejs backend. The data is provided by WebSocket. The files are provided
by express(a middleware for the nodejs http server). There is a [online demo](http://wittem.puppis.uberspace.de/chat/).


Build
-----
There is a Gruntfile.js for building the webapp with grunt so you need [grunt](http://gruntjs.com/). Just run on CLI:

	npm install
	grunt
	grunt server
	// or run native:
	node build/app.js


Browser support
---------------
This application uses WebSockets. This works for nearly every current Browser:
[caniuse.com/websockets](http://caniuse.com/websockets)


Thanks to
---------
- Twitter for Bootstrap
- Designmodo for the Chatlogo which I used as icon


Licence
-------
It is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License,
either version 3 of the License, or (at your option) any later version.

by [Matthias Witte](http://www.matthias-witte.net)