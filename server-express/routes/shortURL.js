var express = require('express');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var visitLog = require('../modules/visitLog');

var router = express.Router();

var mysql = require('mysql');
var db = mysql.createConnection({
  host     : process.env.DB_HOST_d,
  user     : process.env.DB_USER_d,
  password : process.env.DB_PASS_d,
  database : process.env.DB_NAME_d
});

router.all('/:url', (req, res, next) => {
  req.lookup_url = req.params.url;
  // check if short url exists
  db.query('SELECT id, long_url, title FROM url_pairs WHERE short_url=? AND (expire IS NULL OR expire>?)', [req.lookup_url, moment().toISOString()], (err, result, fields) => {
    if (err) throw(err);
    if (result.length) {
      var title = result[0].title ? result[0].title : 'Redirecting...';
      req.target_url = result[0].long_url;
      db.query('UPDATE url_pairs SET count=count+1 WHERE id=?', [result[0].id], (err, result, fields) => { if (err) throw err; });
      // log detailed successful redirection
      visitLog.log(req);
      // redirect
      fs.readFile(path.join(__dirname, '/../views/redirect.html'), (err, file) => {
        if (err) throw err;
        file = file.toString().split('{{url}}').join(req.target_url).split('{{title}}').join(title);
        return res.send(file);
      });
  } else {
      // not found, log detailed unsuccessful redirection
      visitLog.log(req);
      res.redirect('/?e=NotFound');
    } 
  });
  return;
});

module.exports = router;
