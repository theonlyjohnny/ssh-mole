const colors = require("colors");
const _SSH = require("./classes/ssh/ssh.js");
const _ngrok = require("./classes/ngrok");
const _API = require("./classes/api");
const API = new _API();

const auth = {
  username: API.genUs(),
  password: API.genPs()
}

const SSH = new _SSH(auth);
const ngrok = new _ngrok();


process.on("uncaughtException", (err) => {
  console.log(colors.red(err));
})

SSH.start(() => {
  ngrok.connect()
    .then((url) => {
      console.log(colors.green(`Successfully made ngrok tunnel from ${url} to localhost:9447`));
      API.makeSession(auth, url)
        .then((session_id) => {
          console.log(colors.green(`Successfully made ${session_id} session`));
          setTimeout(() => {
            API.ping(session_id);
          }, 500);
        });
    }).catch((err) => {
      console.log(colors.red(`Could not create ngrok tunnel -- ${err}`));
    })
})
