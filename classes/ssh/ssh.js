const ssh = require('ssh2'),
  colors = require('colors'),
  fs = require("fs"),
  cp = require("child_process");

class SSH {
  constructor(auth, timeout) {
    this.auth = auth;
    this.timeoutTime = 7200000 || timeout;
    
    this.process = null;
    this.connected = false;
    this.cpHasListener = false;
    this.hostFile = fs.readFileSync("./classes/ssh/host");

    this.handleSession = this.handleSession.bind(this);
    this.execCmd = this.execCmd.bind(this);
  }

  handleDisconnect() {
    this.connected = false;
    console.log(colors.red(`Client disconnected`));
    this.timer = setTimeout(() => {
      if (this.process) {
        this.process.kill()
      }
    }, this.timeoutTime);
  }

  resp(data) {
    console.log(colors.cyan(`Read -- ${JSON.stringify(data)}`));
    this.stream.write(data);
  }

  err(data) {
    console.log(colors.red(`Err -- ${JSON.stringify(data)}`));
    if (this.stream) this.stream.write(`Error: ${data}`);
  }

  stderr(data) {
    console.log(colors.yellow(`Stderr -- ${JSON.stringify(data)}`));
  }

  execCmd(cmd) {
    cmd = cmd.toString().substring(-2);
    console.log(colors.yellow(`Executing ${cmd}`));
    if (!this.cpHasListener) {
      this.process.stdout.on('data', (data) => {
        this.resp(data);
      })
      this.cpHasListener = true;
    }
    this.process.stdin.write(cmd + '\n');
  }

  handleSession(acp) {
    this.session = acp();
    this.session.on("pty", (acp) => acp());
    this.session.on('shell', (acp) => {
      this.stream = acp();
      this.stream.on('data', this.execCmd);
      this.process = cp.spawn('bash').on('close', () => {
          if (this.connected === true) {
            console.log(colors.red(`Bash session quit unexpectedly.`));
          } else {
            console.log(colors.green('Bash quit gracefully'));
          }
        })
        .on('error', this.err);
    });
  }

  start(cb) {
    this.server = new ssh.Server({ hostKeys: [this.hostFile] }, (client) => {
      console.log(colors.green('Client created connection'));
      client.on('authentication', (ctx) => {
          if (ctx.method === 'password' && ctx.username === this.auth.username && ctx.password === this.auth.password) {
            ctx.accept();
            console.log(colors.green(`${ctx.username} has been authed in`));
          } else {
            ctx.reject();
          }
        })
        .on('ready', () => {
          client.on('session', this.handleSession);
        })
        .on('end', this.handleDisconnect)
    })
    this.server.listen(9447, '127.0.0.1', function() {
      console.log(colors.cyan(`SSH server listening on ${this.address().port}`));
      cb();
    })
  }
}
module.exports = SSH;
