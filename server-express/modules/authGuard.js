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

module.exports = guard;