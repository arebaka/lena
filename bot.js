const Telegraf = require("telegraf").Telegraf;

const db     = require("./db");
const config = require("./config");
const logger = require("./logger");

const middlewares = require("./middlewares");
const commands    = require("./commands");
const handlers    = require("./handlers");
const callbacks   = require("./callbacks");




class Bot
{
    constructor(token)
    {
        this.token    = token;
        this.username = null;
        this.bot      = new Telegraf(this.token);

        this.bot.use(middlewares.update);

        this.bot.start(commands.start);

        this.bot.command("on",       commands.on);
        this.bot.command("off",      commands.off);
        this.bot.command("onjoin",   commands.onjoin);
        this.bot.command("onleft",   commands.onleft);
        this.bot.command("list",     commands.list);
        this.bot.command("trigger",  commands.trigger);
        this.bot.command("settings", commands.settings);
        this.bot.command("edit",     commands.edit);

        this.bot.on("text",             handlers.text);
        this.bot.on("new_chat_members", handlers.new_chat_members);
        this.bot.on("left_chat_member", handlers.left_chat_member);

        this.bot.action(/^lang:([^:]+)$/,                callbacks.lang);
        this.bot.action(/^settings:([^:]+)(:[^:]+)?$/,   callbacks.settings);
        this.bot.action(/^edit:(\d+):([^:]+)(:[^:]+)?$/, callbacks.edit);
        this.bot.action(/^auto_delete:(\d+):(\d+)$/,     callbacks.auto_delete);
    }

    async start()
    {
        await db.start();

        this.bot
            .launch(config.params)
            .then(res => {
                this.username = this.bot.botInfo.username;
                logger.info(`Bot @${this.username} started.`);
            })
            .catch(err => {
                logger.error(err);
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




module.exports = Bot;
