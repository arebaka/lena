const bind = require("../bind");

module.exports = async ctx => {
    const i18n = ctx.chat.i18n.commands.onleft;

    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_in_groups);
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_for_admins);
    if (!ctx.message.reply_to_message)
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_needs_to_reply);

    const trigger = await bind(ctx.message.reply_to_message, true, "left");

    ctx.replyWithMarkdown(trigger
        ? i18n.responses.ok.replace("{{index}}", trigger.index)
        : i18n.responses.cannot
    );
};
