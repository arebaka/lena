const db   = require("../db");
const bind = require("../bind");

module.exports = async ctx => {
    const _    = ctx.chat._.commands.onleft;
    const chat = await db.getChat(ctx.chat.id);

    if (ctx.chat.type != "private" && !ctx.from.isAdmin && chat.only_admins)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);
    if (!ctx.message.reply_to_message)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_needs_to_reply);

    const trigger = await bind(ctx.message.reply_to_message, true, "left");

    ctx.replyWithMarkdown(trigger
        ? _.responses.ok.replace("{index}", trigger.index)
        : _.responses.cannot
    );
};
