const rl = require("serverline");

const Bot    = require("./bot");
const config = require("./config");
const logger = require("./logger");

process.stdin.setEncoding("utf8");
process.stderr.setEncoding("utf8");

const bot = new Bot(config.bot.token);

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
	rl.question("Confirm exit: ", answer =>
		answer.match(/^y(es)?$/i)
			? bot.stop()
			: rl.output.write("\x1b[1K> "));
});

process.on("SIGINT",  bot.stop);
process.on("SIGTERM", bot.stop);

process.on("uncaughtException", e => {
	logger.error(e);
	bot.reload();
});

bot.start();
