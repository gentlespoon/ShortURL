var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var requestIp = require('request-ip');
var geoip = require('geoip-lite');
var visitLog = require('./modules/visitLog');


require('dotenv').config();

var app = express();

var allowCORS = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCORS);
app.use(requestIp.mw())
app.use((req, res, next) => {
  req.location = '';
  req.loc = geoip.lookup(req.clientIp);
  if (req.loc) {
    req.location = req.loc.city + ', ' + req.loc.region + ', ' + req.loc.country;
  }
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// First handle API requests
var apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// Then, for index requests, log and then serve static file;
app.get('/', function(req, res, next) {
  visitLog.log(req);
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// If the request is not a file, check in Short URL DB;
// If short URL exists, redirect to long URL;
// If short URL does not exist, go to index with error message;
var sUrouter = require('./routes/shortURL');
app.use(sUrouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  let resObj = {
    result: 0,
    error: err.message
  };
  console.log(err.message);
  console.log(err.stack);
  res.send(JSON.stringify(resObj, null, 2));
});


module.exports = app;
