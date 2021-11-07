const path = require("path");
const fs   = require("fs");

const { Telegraf, Markup } = require("telegraf");

const db     = require("./db");
const config = require("./config");
const invoke = require("./invoke");

const commands  = require("./commands");
const callbacks = require("./callbacks");
const i18n      = require("./i18n");




class Bot
{
    constructor(token, username)
    {
        this.token    = token;
        this.username = null;
        this.bot      = new Telegraf(this.token);

        this.bot.use(async (ctx, next) => {
            try {
                ctx.from && await db.updateUser(
                    ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name
                );

                if (ctx.chat) {
                    const lang = await db.updateChat(
                        ctx.chat.id, ctx.chat.username,
                        ctx.chat.title || ctx.chat.first_name
                    );
                    ctx.chat._ = i18n[lang];

                    if (ctx.chat.type != "private") {
                        await this.bot.telegram.getChatAdministrators(ctx.chat.id)
                            .then(admins => {
                                ctx.chat.admins  = admins;
                                ctx.from.isAdmin = admins.some(admin => admin.user.id == ctx.from.id);
                            })
                            .catch(err => {});
                    }
                }
                else {
                    ctx.chat = {
                        _: i18n.eng
                    };
                }

                await next();
            }
            catch (err) {
                console.error(err);
                ctx.replyWithMarkdown(ctx.chat._ ? ctx.chat._.errors.default : "Что то пошло не так!");
            }
        });

        this.bot.on("callback_query", async ctx => {
            const query = ctx.update.callback_query;
            const data  = query.data.split(':');

            switch (data[0]) {
                case "lang":        return callbacks.lang(ctx, data);
                case "settings":    return callbacks.settings(ctx, data);
                case "auto_delete": return callbacks.autoDelete(ctx, data);
                default:            return ctx.answerCbQuery(ctx.chat._.errors.unknown_callback, true);
            }
        });

        this.bot.start(async ctx => {
            const markup = Markup.inlineKeyboard([
                    Markup.button.callback("English", "lang:eng"),
                    Markup.button.callback("Русский", "lang:rus")
                ]);

            ctx.replyWithMarkdown("Choose the language\nВыберите язык", markup);
        });

        this.bot.command("on",       commands.on);
        this.bot.command("off",      commands.off);
        this.bot.command("onjoin",   commands.onjoin);
        this.bot.command("onleft",   commands.onleft);
        this.bot.command("list",     commands.list);
        this.bot.command("trigger",  commands.trigger);
        this.bot.command("settings", commands.settings);

        this.bot.on("text", async ctx => {
            const text = ctx.message.text
                .trim().split(/\s+/g).join(' ');

            const chat     = await db.getChat(ctx.chat.id);
            const triggers = await db.findTriggers(ctx.chat.id, text, text.toLowerCase());

            for (let trigger of triggers) {
                trigger = await db.getTrigger(ctx.chat.id, trigger);
                await invoke(ctx, trigger);
            }
        });

        this.bot.on("new_chat_members", async ctx => {
            const triggers = await db.getActionTriggers(ctx.chat.id, "join");

            for (let trigger of triggers) {
                trigger = await db.getTrigger(ctx.chat.id, trigger);
                await invoke(ctx, trigger);
            }
        });

        this.bot.on("left_chat_member", async ctx => {
            const triggers = await db.getActionTriggers(ctx.chat.id, "left");

            for (let trigger of triggers) {
                trigger = await db.getTrigger(ctx.chat.id, trigger);
                await invoke(ctx, trigger);
            }
        });
    }

    async start()
    {
        await db.start();

        this.bot
            .launch(config.params)
            .then(res => {
                this.username = this.bot.botInfo.username;
                console.log(`Bot @${this.username} started.`);
            })
            .catch(err => {
                console.error(err);
                this.bot.stop();
            });
    }

    async stop()
    {
        console.log(`Stop the bot @${this.username}`);

        this.bot.stop();
        await db.stop();
    }

    async reload()
    {
        console.log(`Reload the bot @${this.username}`);

        await this.stop();
        await this.start();
    }
}




module.exports = Bot;
