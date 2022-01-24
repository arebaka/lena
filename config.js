const path = require("path");
const fs   = require("fs");
const toml = require("toml");

let config = toml.parse(fs.readFileSync(path.resolve("config.toml")));

config.bot.token = process.env.TOKEN || config.bot.token;
config.db.uri    = process.env.DBURI || config.db.uri;

module.exports = config;
