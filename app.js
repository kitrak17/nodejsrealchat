var express = require('express'),
http = require('http'),
app = express(),
port = 8080, // Use 8079 for dev mode
server = http.createServer(app).listen(process.env.PORT || port, function(){
    console.log('Express server listening on port %d in %s mode', server.address().port,             app.settings.env);
}),
io = require('socket.io').listen(server),
routes = require('./routes');

// Configuration

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});

// Routes
app.get('/', routes.index);

var status = "All is well.";
io.sockets.on('connection', function (socket) {
    io.sockets.emit('status', { status: status }); // note the use of io.sockets to emit but         socket.on to listen
    socket.on('reset', function (data) {
        status = "War is imminent!";
        io.sockets.emit('status', { status: status });
    });
});
