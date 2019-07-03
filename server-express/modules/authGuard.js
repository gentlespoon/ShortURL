var api = require('./apiFormat');
var auth = require('./auth');

function guard(req, res, next) {
  if (req.body.token) {
    let jwt = auth.verify(req.body.token);
    if (jwt) {
      req.account_id = jwt.uid;
      return next();
    }
  }
  return res.send(api(0, 'Unauthorized'));
}

function validate(token) {
  if (token) {
    let jwt = auth.verify(token);
    if (jwt) {
      return jwt.uid;
    }
  }
  return false;
}

module.exports = { middleware: guard, validate: validate };
