const path = require("path");
const fs   = require("fs");
const yaml = require("yaml");

module.exports = {
	eng: yaml.parse(fs.readFileSync(path.resolve("i18n/eng.yaml"), "utf8")),
	rus: yaml.parse(fs.readFileSync(path.resolve("i18n/rus.yaml"), "utf8"))
};
