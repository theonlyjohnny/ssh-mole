const colors = require("colors");
const _SSH = require("./ssh");
const _ngrok = require("./ngrok");
const _API = require("./api");
const API = new _API();
const ngrok = new _ngrok();

const auth = {
  username: API.genUs(),
  password: API.genPs()
}

const SSH = new _SSH(auth);
let counter;

SSH.start(() => {
  ngrok.connect()
    .then((url) => {
      console.log(colors.green(`Successfully made ngrok tunnel from ${url} to localhost:9447`));
      API.makeSession(auth, url)
        .then((session_id) => {
          console.log(colors.green(`Successfully made ${session_id} session`));
          counter = setTimeout(() => {
            API.ping(session_id);
          }, 500);
        });
    }).catch((err) => {
      console.log(colors.red(`Could not create ngrok tunnel -- ${err}`));
    })
})
