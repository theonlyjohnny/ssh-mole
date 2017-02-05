const uuid = require("uuid"),
  crypto = require("crypto"),
  os = require("os"),
  request = require("request-promise"),
  config = require("./config.js");

class API {
  genUs() {
    return uuid.v4();
  }
  genPs() {
    return crypto.createHash('sha256').update(uuid.v4()).digest('base64');
  }
  makeSession(auth, url) {
    const osInfo = os.userInfo();
    const data = {
      username: auth.username,
      password: auth.password,
      name: osInfo.username + `-${osInfo.uid}`,
      url: url
    }
    const opts = {
      method: 'POST',
      url: `${config.api}/session/new`,
      json: true,
      body: data
    }
    return request(opts);
  }
  ping(session_id) {
    return request(`${config.api}/session/ping?session_id=${session_id}`);
  }
}
module.exports = API;
