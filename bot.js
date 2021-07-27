const path = require("path");
const fs   = require("fs");

const { Telegraf }   = require("telegraf");

const db     = require("./db");
const config = require("./config");
const invoke = require("./invoke");

const commands  = require("./commands");




class Bot
{
    constructor(token, username)
    {
        this.token    = token;
        this.username = null;
        this.greeting = fs.readFileSync(path.resolve("greeting"), "utf8");
        this.bot      = new Telegraf(this.token);

        this.bot.use(async (ctx, next) => {
            try {
                !ctx.user || await db.updateUser(
                    ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name
                );

                if (ctx.chat) {
                    await db.updateChat(
                        ctx.chat.id, ctx.chat.username, ctx.chat.title
                    );

                    const admins = await this.bot.telegram.getChatAdministrators(ctx.chat.id);

                    if (admins) {
                        ctx.chat.admins  = admins;
                        ctx.from.isAdmin = admins.some(admin => admin.user.id == ctx.from.id);
                    }
                }

                await next();
            }
            catch (err) {
                console.error(err);
                ctx.replyWithMarkdown("Что то пошло не так!");
            }
        });

        this.bot.start(ctx => {
            ctx.replyWithMarkdown(this.greeting);
        });

        this.bot.command("on",      commands.on);
        this.bot.command("off",     commands.off);
        this.bot.command("onjoin",  commands.onjoin);
        this.bot.command("onleft",  commands.onleft);
        this.bot.command("list",    commands.list);
        this.bot.command("trigger", commands.trigger);

        this.bot.on("text", async ctx => {
            const text = ctx.message.text
                .trim().toLowerCase().split(/\s+/g).join(' ');

            const triggers = await db.findTriggers(ctx.chat.id, text);

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
