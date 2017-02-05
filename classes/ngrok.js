const Promise = require("bluebird"),
  ngrok = require("ngrok");


class Ngrok {
  connect() {
    return new Promise((res, rej) => {
      ngrok.connect({
        proto: 'tcp',
        addr: 9447
      }, (err, url) => {
        if (err) {
          return rej(err);
        }
        return res(url);
      });
    })
  }
}

module.exports = Ngrok;
