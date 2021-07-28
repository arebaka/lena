const db = require("../db");

module.exports = async ctx => {
    const i18n  = ctx.chat.i18n.commands.off;
    const index = ctx.message.text
        .trim().split(' ').slice(1).join(' ');

    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_in_groups);
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_for_admins);
    if (!/^\d+$/.test(index))
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.trigger_number_is_required);

    const trigger = await db.remTrigger(ctx.chat.id, parseInt(index));

    ctx.replyWithMarkdown(trigger
        ? i18n.responses.ok.replace("{{index}}", trigger.index)
        : i18n.responses.not_found
    );
};
