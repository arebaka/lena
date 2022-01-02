const rl = require("serverline");

const Bot    = require("./bot");
const config = require("./config");
const logger = require("./logger");

process.stdin.setEncoding("utf8");
process.stderr.setEncoding("utf8");

const bot = new Bot(config.token);

rl.init();
rl.setCompletion(["stop", "reload"]);
rl.setPrompt("> ");

rl.on("line", async line => {
	const command = line.trim();

	switch (command) {
		case "stop":
			await bot.stop();
		break;
		case "reload":
			await bot.reload();
		break;
	}
});

rl.on("SIGINT", rl => {
	rl.question("Confirm exit: ", async answer =>
		answer.match(/^y(es)?$/i)
			? await bot.stop()
			: rl.output.write("\x1b[1K> "));
});

process.on("uncaughtException", logger.error);
bot.start();
