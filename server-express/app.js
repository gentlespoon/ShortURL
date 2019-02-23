var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var logger = require('morgan');
require('dotenv').config();

var apiRouter = require('./routes/api');

var app = express();

// Session
var sess = {
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {}
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies, requires HTTPS
}
app.use(session(sess));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

// Send Angular
app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.send(err.toString());
});

module.exports = app;
