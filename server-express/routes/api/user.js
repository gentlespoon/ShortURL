var express = require('express');
var bcrypt = require('bcryptjs');
var uuidv4 = require('uuid/v4');

var moment = require('moment');
var momentFormat = process.env.momentFormat;

var router = express.Router();

var mysql = require('mysql');
var db_user = mysql.createConnection({
  host     : process.env.DB_HOST_u,
  user     : process.env.DB_USER_u,
  password : process.env.DB_PASS_u,
  database : process.env.DB_NAME_u
});

var api = require('../../modules/apiFormat');
var email = require('../../modules/email');
var auth = require('../../modules/auth');

router.all('/', (req, res, next) => { res.send(api(0, '?')); });

router.post('/login', (req, res, next) => {
  // validate input type
  if (typeof req.body.email !== 'string' || req.body.email === ''
   || typeof req.body.password !== 'string' || req.body.password === '')
    return res.send(api(0, 'Incomplete credentials.'));
  // get user from database
  db_user.query("SELECT account_id, password, display_name FROM accounts WHERE (login_name=? OR email=?) AND banned_time<?", [req.body.email, req.body.email, moment().toISOString()], (err, result, fields) => {
    if (err) return res.send(api(0, err));
    if (result.length) {
      // if user exists, compare password
      if (bcrypt.compareSync(req.body.password, result[0].password)) {
        var account_id = result[0].account_id;
        db_user.query("INSERT INTO login_history (auth_login, auth_time_iso, remote_address, from_application, result, account_id) VALUES (?, ?, ?, ?, ?, ?)", [
          req.body.email, moment().toISOString(), req.connection.remoteAddress, process.env.appName, 'success', account_id]);
        return res.send(api(1, {token: auth.create({uid: account_id}), display_name: result[0].display_name}));
      } else {
        // if user does not exist / incorrect password
        db_user.query("INSERT INTO login_history (auth_login, auth_time_iso, remote_address, from_application, result) VALUES (?, ?, ?, ?, ?)", [
          req.body.email, moment().toISOString(), req.connection.remoteAddress, process.env.appName, 'fail - incorrect password']);
        return res.send(api(0, 'Invalid credentials.'));
      }
    } else {
      // if user does not exist / incorrect password
      db_user.query("INSERT INTO login_history (auth_login, auth_time_iso, remote_address, from_application, result) VALUES (?, ?, ?, ?, ?)", [
            req.body.email, moment().toISOString(), req.connection.remoteAddress, process.env.appName, 'fail - email not found']);
      return res.send(api(0, 'Email is not registered.'));
    }
  });
});


router.post('/checkDuplicateEmail', (req, res, next) => {
  // validate input type
  if (req.body.email) {
    if (typeof req.body.email !== 'string' || !email.validate(req.body.email))
      return res.send(api(0, 'Invalid email.'));
    db_user.query("SELECT account_id FROM accounts WHERE email=?", [req.body.email], (err, result, fields) => {
      if (err) return res.send(api(0, err));
      if (result.length) return res.send(api(0, 'Email is already registered.'));
      return res.send(api(1));
    });
  }
});


router.post('/register', (req, res, next) => {
  // validate input type
  if (typeof req.body.email !== 'string' || !email.validate(req.body.email)
   || typeof req.body.password !== 'string' || req.body.password === ''
  )
    return res.send(api(0, 'Incomplete credentials.'));
  var account_id = uuidv4();
  // Check for duplicate username
  db_user.query("SELECT account_id, login_name FROM accounts WHERE email=? OR account_id=?", [req.body.email, account_id], (err, result, fields) => {
    if (err) return res.send(api(0, err));
    if (result.length) return res.send(api(0, 'Email is already registered.'));
    // If username is not taken, check password strength.
    if (req.body.password.length < 8)
      return res.send(api(0, 'Password must not be shorter than 8 characters.'));
    if (req.body.password.match(/[A-Z]/g) === null)
      return res.send(api(0, 'Password must contain at least 1 upper case letter.'));
    if (req.body.password.match(/[a-z]/g) === null)
      return res.send(api(0, 'Password must contain at least 1 lower case letter.'));
    if (req.body.password.match(/[0-9]/g) === null)
      return res.send(api(0, 'Password must contain at least 1 digit.'));
    // hash password
    var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    db_user.query("INSERT INTO accounts (account_id, display_name, email, password, register_time) VALUES (?, ?, ?, ? ,?)", [account_id, 'Unnamed', req.body.email, hash, moment().toISOString()], (err, result, fields) => {
      if (err) return res.send(api(0, err));
      // schedule a welcome email
      let mail = {
        from: 'GsServices',
        to: req.body.email,
        subject: 'Welcome to Gs-ShortURL',
        html: email.template('register')
      };
      email.send(mail);
      db_user.query('SELECT * FROM accounts WHERE account_id=?', [account_id], (err, result, fields) => {
        if (err) return res.send(api(0, err));
        if (!result.length) return res.send(api(0, 'Failed to get user from UserCenter'));
        return res.send(api(1, {token: auth.create({uid: result[0].account_id}), display_name: result[0].display_name}));
      })
    });
  });
});


router.post('/forgot', (req, res, next) => {
  if (typeof req.body.email !== 'string' || req.body.email === '') return res.send(api(0, 'Not enough info for retrieving password.'));
  db_user.query('SELECT account_id FROM accounts WHERE email=?', [req.body.email], (err, result, fields) => {
    if (err) return res.send(api(0, err));
    if (result.length) {
      let token = uuidv4();
      let account_id = result[0].account_id;
      db_user.query('INSERT INTO tokens (purpose, account_id, token, expire) VALUES (?, ?, ?, ?)', ['reset', account_id, token, moment().add(1, 'd').toISOString()], (err, result, fields) => {
        if (err) return res.send(api(0, err));
        // schedule a welcome email
        let mail = {
          from: 'me@gentlespoon.com',
          to: req.body.email,
          subject: 'Reset your password - Gs-ShortURL',
          html: email.template('forget').split('{{token}}').join(token)
        };
        email.send(mail);
        return res.send(api(1, 'If your email address is in our database, you will receive a link to reset your password shortly.'));
      })
    } else {
      // although user does not exist, send the same success message to prevent info leak
      return res.send(api(1, 'If your email address is in our database, you will receive a link to reset your password shortly'));
    }
  })
});

router.post('/checkToken', (req, res, next) => {
  if (req.body.token) {
    db_user.query('SELECT account_id FROM tokens WHERE token=? AND expire>? AND used=0 AND purpose=?', [req.body.token, moment().toISOString(), 'reset'], (err, result, fields) => {
      if (err) return res.send(api(0, err));
      if (result.length) {
        var account_id = result[0].account_id;
        db_user.query('UPDATE tokens SET used=1 WHERE token=?', [req.body.token], (err, result, fields) => {
          if (err) res.send(api(0, 'Failed to update token status'));
          req.session.resetAccount = account_id;
          return res.send(api(1, 'Valid token'));
        })
      } else {
        req.session.resetAccount = '';
        return res.send(api(0, 'Invalid token'));
      }
    })
  }
});

router.post('/reset', (req, res, next) => {
  // validate input type
  if (!req.session.resetAccount)
    return res.send(api(0, 'Which account are you trying to reset?'));
  if (typeof req.body.password !== 'string' || req.body.password === '')
    return res.send(api(0, 'Incomplete credentials.'));
  // Check password strength.
  if (req.body.password.length < 8)
    return res.send(api(0, 'Password must not be shorter than 8 characters.'));
  if (req.body.password.match(/[A-Z]/g) === null)
    return res.send(api(0, 'Password must contain at least 1 upper case letter.'));
  if (req.body.password.match(/[a-z]/g) === null)
    return res.send(api(0, 'Password must contain at least 1 lower case letter.'));
  if (req.body.password.match(/[0-9]/g) === null)
    return res.send(api(0, 'Password must contain at least 1 digit.'));
  var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  db_user.query("UPDATE accounts SET password=? WHERE account_id=?", [hash, req.session.resetAccount], (err, result, fields) => {
    if (err) return res.send(api(0, 'Failed to reset password.'));
    return res.send(api(1, 'Password has been reset.'));
  });
});



module.exports = router;
