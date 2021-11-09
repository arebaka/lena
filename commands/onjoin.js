const db   = require("../db");
const bind = require("../bind");

module.exports = async ctx => {
    const _    = ctx.chat._.commands.onjoin;
    const chat = await db.getChat(ctx.chat.id);

    if (ctx.chat.type != "private" && !ctx.from.isAdmin && chat.only_admins)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);
    if (!ctx.message.reply_to_message)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_needs_to_reply);

    const trigger = await bind(ctx.message.reply_to_message, ctx.from.id, true, "join");

    const markup = Markup.inlineKeyboard([[
        Markup.button.callback(
            _.buttons.edit,
            `edit:${trigger.index}`
        )
    ]]);

    trigger
        ? ctx.replyWithMarkdown(_.responses.ok.replace("{index}", trigger.index), markup)
        : ctx.replyWithMarkdown(_.responses.cannot);
};
