const path = require("path");
const fs   = require("fs");
const yaml = require("yaml");

module.exports = {
	eng: yaml.parse(fs.readFileSync(path.resolve("./eng.yaml"))),
	rus: yaml.parse(fs.readFileSync(path.resolve("./rus.yaml")))
};
