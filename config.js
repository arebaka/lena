const path = require("path");
const fs   = require("fs");
const toml = require("toml");

const config = toml.parse(fs.readFileSync(path.resolve("config.toml")));




module.exports = {
	token:  process.env.TOKEN || config.bot.token,
	dbUri:  process.env.DBURI || config.bot.db_uri,
	params: config.params
};
