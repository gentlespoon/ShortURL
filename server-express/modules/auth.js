var moment = require('moment');
var api = require('./apiFormat');
var jwt = require('jwt-simple');

require('dotenv').config();

class SessionToken {

  constructor () {
    this.secret = process.env.sessionSecret;
  }



  /**
   * @param {object} obj // Object to be encrypted
   */
  _encode(obj) {
    return jwt.encode(obj, this.secret);
  }



  /**
   * @param {string} str // Encrypted token
   */
  _decode(str) {
    // console.log(str);
    return jwt.decode(str, this.secret);
  }



  /**
   * @param {string|object} obj
   */
  create(obj) {
    switch (typeof obj) {
      case 'string':
        obj = {data: obj};
        break;
      case 'object':
        break;
      default:
        throw 'Unacceptable input type';
    }
    if (!obj.exp) {
      obj.exp = moment().add(8, 'h').toISOString();
    }
    return this._encode(obj);
  }
  


  /**
   * @param {string} str // Encrypted token
   */
  verify(str) {
    var decoded = false;
    try {
      decoded = this._decode(str);
      if (decoded) {
        if (decoded.exp < moment().toISOString()) {
          return false;
        }
      }
    } catch (err) {
    }
    return decoded;
  }



}

module.exports = new SessionToken();