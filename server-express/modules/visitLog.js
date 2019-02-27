var mysql = require('mysql');
var moment = require('moment');


class VisitLog {
  constructor () {
  }

  log(req) {
    var db = mysql.createConnection({
      host     : process.env.DB_HOST_d,
      user     : process.env.DB_USER_d,
      password : process.env.DB_PASS_d,
      database : process.env.DB_NAME_d
    });
    if (req.lookup_url === undefined) req.lookup_url = null;
    if (req.target_url === undefined) req.target_url = null;
    var ip = req.ip + request.connection.remoteAddress + request.headers['x-forwarded-for']?request.headers['x-forwarded-for']:'';
    db.query('INSERT INTO history (request_url, short_url, long_url, request_time, ip, location, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.url, req.lookup_url, req.target_url, moment().toISOString(), ip, req.location, req.headers["user-agent"]], (err, result, fields) => {
      if (err) throw err;
    });
  }
}

module.exports = new VisitLog();