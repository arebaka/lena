const Telegraf = require("telegraf").Telegraf;

const db     = require("./db");
const config = require("./config");
const logger = require("./logger");

const middlewares = require("./middlewares");
const commands    = require("./commands");
const handlers    = require("./handlers");
const callbacks   = require("./callbacks");

module.exports = class Bot
{
	constructor(token)
	{
		this.token    = token;
		this.username = null;
		this.bot      = new Telegraf(this.token);

		this.bot.use(middlewares.update);

		this.bot.start(commands.start);

		for (let command of ["on", "off", "onjoin", "onleft", "list", "trigger", "settings", "edit"]) {
			this.bot.command(command, commands[command]);
		}

		for (let event of [
			"text",
			"new_chat_members",
			"left_chat_member"
		]) {
			this.bot.on(event, handlers[event]);
		}

		this.bot.action(/^lang:([^:]+)$/,                 callbacks.lang);
		this.bot.action(/^settings:([^:]+)(:[^:]+)?$/,    callbacks.settings);
		this.bot.action(/^edit:(\d+)(:[^:]+)?(:[^:]+)?$/, callbacks.edit);
		this.bot.action(/^auto_delete:(\d+):(\d+)$/,      callbacks.auto_delete);
	}

	async start()
	{
		await db.start();

		this.bot
			.launch(config.bot.params)
			.then(res => {
				this.username = this.bot.botInfo.username;
				logger.info(`Bot @${this.username} started.`);
			})
			.catch(err => {
				logger.fatal(err);
				process.exit(1);
			});
	}

	async stop()
	{
		logger.info(`Stop the bot @${this.username}`);

		await this.bot.stop();
		await db.stop();

		process.exit(0);
	}

	async reload()
	{
		logger.info(`Reload the bot @${this.username}`);

		await this.bot.stop();
		await db.stop();
		await this.start();
	}
}
