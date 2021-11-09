const Markup = require("telegraf").Markup;

const db = require("../db");

module.exports = async ctx => {
    let markup;
    let _ = ctx.chat._.commands.settings;

    const chat = await db.getChat(ctx.chat.id);

    if (ctx.chat.type != "private" && !ctx.from.isAdmin)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);

    markup = Markup.inlineKeyboard([
        [Markup.button.callback(
            _.buttons.only_admins
                .replace("{indicator}", _.indicators[chat.only_admins ? "on" : "off"]),
            `settings:only_admins:${chat.only_admins ? "off" : "on"}`
        )],

        [Markup.button.callback(_.buttons.change_lang, "settings:change_lang")],

        [Markup.button.callback(_.buttons.done, "settings:done")]
    ]);

    ctx.replyWithMarkdown(_.text, markup);
};
