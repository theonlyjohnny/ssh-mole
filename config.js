const config = {
  "prod": {
  	api: "https://mole-api.herokuapp.com"
  },
  "local": {
  	api: "http://localhost:8080"
  }
}

module.exports = config[process.env.NODE_ENV || "prod"];
