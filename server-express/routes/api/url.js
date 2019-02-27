var express = require('express');
var moment = require('moment');

var router = express.Router();


var mysql = require('mysql');
var db = mysql.createConnection({
  host     : process.env.DB_HOST_d,
  user     : process.env.DB_USER_d,
  password : process.env.DB_PASS_d,
  database : process.env.DB_NAME_d
});

var api = require('../../modules/apiFormat');
var auth = require('../../modules/auth');
var authGuard = require('../../modules/authGuard');

var reservedShortURL = ['index.html', 'api', 'user', 'dashboard', 'admin'];
function sanitizeShortURL(url) {
  for (var i of reservedShortURL) {
    if (url.indexOf(i) !== -1) {
      return false;
    }
  }
  return true;
}


router.all('/', (req, res, next) => { res.send(api(0, '?')); });


// add new pair
router.post('/add', (req, res, next) => {
  if (typeof req.body.long_url !== 'string' || req.body.long_url === '')
    return res.send(api(0, 'API requires a JSON [long_url] parameter.'));
  req.account_id = authGuard.validate(req.body.token);
  var UrlObj = {
    long_url: req.body.long_url,
    short_url: req.account_id ? (req.body.short_url ? req.body.short_url : null) : null,
    title: req.body.title ? req.body.title : null,
    expire: req.account_id ? (req.body.expire ? req.body.expire : moment('2099-12-31T23:59:59.000Z').toISOString()) : moment().add(1, 'y').toISOString(),
  };
  if (UrlObj.short_url && !sanitizeShortURL(UrlObj.short_url)) UrlObj.short_url = null;
  if (!req.account_id) {
    // check for count(created-url-in-a-day)
    db.query('SELECT id FROM url_pairs WHERE ip=? AND create_date>?', [req.ip, moment().add(-1, 'd').toISOString()], (err, result, fields) => {
      if (err) return res.send(api(0, 'Failed to check submission frequency.'));
      if (result.length > 20) {
        return res.send(api(0, 'Your IP have created more than the maximum number of short URL allowed for guests. Create an account to remove the limit.'));
      }
      prepareShortURL(req, res, 3, UrlObj);
    });
  } else {
    prepareShortURL(req, res, 3, UrlObj);
  }
});

function prepareShortURL(req, res, length, UrlObj) {
  if (!UrlObj.short_url) {
    UrlObj.short_url = '';
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      UrlObj.short_url += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }
  db.query('SELECT id FROM url_pairs WHERE short_url=? AND (expire IS NULL OR expire>?)', [UrlObj.short_url, moment().toISOString()], (err, result, fields) => {
    if (err) return res.send(api(0, 'Failed to generate random shortURL.'));
    if (result.length) {
      UrlObj.short_url = null;
      prepareShortURL(req, res, length+1, UrlObj);
    } else {
      addURL(req, res, UrlObj);
    }
  });
}


function addURL(req, res, UrlObj) {
  db.query(`INSERT INTO url_pairs (
    short_url, long_url, create_date,            ip,     expire,     account_id, title) VALUES (
    ?,         ?,        ?,                      ?,      ?,          ?         , ?)`, [
    UrlObj.short_url, UrlObj.long_url, moment().toISOString(), req.ip, UrlObj.expire, req.account_id, UrlObj.title], (err, result, fields) => {
      if (err) return res.send(api(0, 'Failed to add new URL pair.'));
      db.query('SELECT * FROM url_pairs WHERE short_url=? ORDER BY create_date DESC', [UrlObj.short_url], (err, result, fields) => {
        if (err) return res.send(api(0, 'Failed to gete new UrlPair'));
        return res.send(api(1, result[0]));
      });
    })
}

// check if short URL is available
router.post('/check', (req, res, next) => {
  if (typeof req.body.short_url !== 'string' || req.body.short_url === '')
    return res.send(api(0, 'API requires a JSON [short_url] parameter.'));
  if (!sanitizeShortURL(req.body.short_url)) return res.send(api(0));
  db.query('SELECT id FROM url_pairs WHERE short_url=? AND (expire IS NULL OR expire>?)', [req.body.short_url, moment().toISOString()], (err, result, fields) => {
    if (err) return res.send(api(0, err));
    if (result.length) {
      return res.send(api(0));
    } else {
      return res.send(api(1));
    }
  });
});



// list all urls created by current user / guest (limit 100);
router.all('/list', (req, res, next) => {
  req.account_id = authGuard.validate(req.body.token);
  var limit = ''; var account = '=?';
  if (!req.account_id) { limit = ' LIMIT 100'; account = '=? OR account_id IS NULL'; req.accound_id=''; }
  db.query('SELECT * FROM url_pairs WHERE account_id ' + account + ' ORDER BY create_date' + limit, [req.account_id], (err, result, fields) => {
    if (err) return res.send(api(0, 'Failed to get URL list'));
    return res.send(api(1, result));
  });
});


router.post('/delete', authGuard.middleware, (req, res, next) => {
  db.query('DELETE FROM url_pairs WHERE short_url=? AND account_id=? ORDER BY id DESC LIMIT 1', [req.body.short_url, req.account_id], (err, result, fields) => {
    if (err) return res.send(api(0, 'Failed to delete URL ' + req.body.short_url));
    return res.send(api(1));
  });
});



module.exports = router;
