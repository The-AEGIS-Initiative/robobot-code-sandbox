var createError = require('http-errors');
var express = require('express');
var socket_io = require( "socket.io" );
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routers/index');
var userRouter = require('./src/routers/user');

const bodyparser = require("body-parser");

const cors = require('cors');



// Import child_process + util.promisfify
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { spawn } = require('child_process');

const app = express();

// Initialize env variables
// Automatically switches between dev and prod
require('dotenv').config(
	{ 
		path: `./.env.${process.env.NODE_ENV}` 
	})

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({ extended: true }));

// Set CORS
if(process.env.NODE_ENV == "development"){
  app.use(cors({credentials: true, origin: true}));
} else {
  app.use(cors({credentials: true, origin: true}));
}

// Initialize socket.io
var io = socket_io();
if(process.env.NODE_ENV == "development"){
  io.set('origins', '*:*');
} else {
  io.set('origins', '*:*');
}
app.io = io;

// Initialize socket events
require('./src/controllers/sockets/events.js')(io);

// Connect to mongoDB
if(process.env.NODE_ENV != "test"){
  require('./src/model/db_connection.js');
}

// Delete any dangling containers
// TODO: This doesn't really work...
require('./src/controllers/docker/manager.js').resetContainers;

//Routing
app.use('/', indexRouter);
app.use('/user', userRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
