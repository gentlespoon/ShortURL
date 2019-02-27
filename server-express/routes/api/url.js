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



router.all('/', (req, res, next) => { res.send(api(0, '?')); });


// add new pair
router.post('/addRandom', (req, res, next) => {
  if (typeof req.body.long_url !== 'string' || req.body.long_url === '')
    return res.send(api(0, 'API requires a JSON [url] parameter.'));
  // check for count(created-url-in-a-day)
  db.query('SELECT id FROM url_pairs WHERE ip=? AND create_date>?', [req.ip, moment().add(-1, 'd').toISOString()], (err, result, fields) => {
    if (err) return res.send(api(0, 'Failed to check submission frequency.'));
    if (result.length > 20) {
      return res.send(api(0, 'Your IP have created more than the maximum number of short URL allowed for guests. Create an account to remove the limit.'));
    }
    addRandomURL(req, res, req.body.long_url, req.body.title, 3);
  })
});





function addRandomURL(req, res, long_url, title, length, account_id, expiration) {
  var short_url = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
  short_url += possible.charAt(Math.floor(Math.random() * possible.length));
  db.query('SELECT id FROM url_pairs WHERE short_url=? AND (expire IS NULL OR expire>?)', [short_url, moment().toISOString()], (err, result, fields) => {
    if (err) return res.send(api(0, 'Failed to add new URL pair.'));
    if (result.length) {
      setTimeout(() => { addURL(req, res, long_url, title, length++, account_id, expiration); }, 0 );
      return;
    }
    addURL(req, res, short_url, long_url, title, account_id, expiration);
  })
}

function addURL(req, res, short_url, long_url, title, account_id, expiration) {
  if (title === undefined || title === '') title = null;
  if (account_id === undefined) account_id = null;
  expiration = expiration === undefined ? moment().add(1, 'y').toISOString() : moment(expiration).toISOString();
  db.query(`INSERT INTO url_pairs (
    short_url, long_url, create_date,            ip,     expire,     account_id, title) VALUES (
    ?,         ?,        ?,                      ?,      ?,          ?         , ?)`, [
    short_url, long_url, moment().toISOString(), req.ip, expiration, account_id, title], (err, result, fields) => {
      if (err) return res.send(api(0, 'Failed to add new URL pair.'));
      return res.send(api(1, short_url));
    })
}

// check if short URL is available
router.post('/check', (req, res, next) => {
  if (typeof req.body.url !== 'string' || req.body.url === '')
    return res.send(api(0, 'API requires a JSON [url] parameter.'));
  db.query('SELECT id FROM url_pairs WHERE short_url=? AND (expire IS NULL OR expire>?)', [req.body.url, moment().toISOString()], (err, result, fields) => {
    if (err) return res.send(api(0, err));
    if (result.length) {
      return res.send(api(0, req.body.url + ' is taken.'));
    } else {
      return res.send(api(1, req.body.url + ' is available.'));
    }
  });
});


// require authentication

// list all urls created by current user
router.get('/list', authGuard, (req, res, next) => {
  db.query('SELECT * FROM url_pairs WHERE account_id=?', [req.account_id], (err, result, fields) => {
    if (err) return res.send(api(0, 'Failed to get URL list'));
    return res.send(api(1, result));
  });
});


router.post('/addCustom', authGuard, (req, res, next) => {
  if (typeof req.body.long_url !== 'string' || req.body.long_url === '')
    return res.send(api(0, 'API requires a JSON [long_url] parameter.'));
  if (typeof req.body.short_url !== 'string' || req.body.short_url === '') {
    addRandomURL(req, res, req.body.long_url, req.body.title, 3, req.account_id, req.body.expiration);
  } else {
    addURL(req, res, req.body.short_url, req.body.long_url, req.body.title, req.account_id, req.body.expiration);
  }
});


router.delete('/:url', authGuard, (req, res, next) => {
  db.query('DELETE FROM url_pairs WHERE short_url=? AND account_id=? ORDER BY id DESC LIMIT 1', [req.params.url, req.account_id], (err, result, fields) => {
    if (err) return res.send(api(0, 'Failed to delete URL ' + req.params.url));
    return res.send(api(1));
  });
});



module.exports = router;
