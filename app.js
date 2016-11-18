var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;

var routes = require('./routes/index');
var users = require('./routes/users');

const server = express()
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);
//var io = require('socket.io').listen(server);







io.on('connection', function(socket){
  // Joining room & notifying users except sender
  socket.on('join room', function(room,join){
    socket.join(room);
    socket.broadcast.in(room).emit('join room', join);
  });

  // Sending message to all including sender
  socket.on('chat message', function(room,msg){
    io.in(room).emit('chat message', msg);
  });

  // Typing status & notifying users except sender
  socket.on('typing status', function(room,type){
    socket.broadcast.in(room).emit('typing status', type);
  });
});





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
