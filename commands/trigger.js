const db     = require("../db");
const invoke = require("../invoke");

module.exports = async ctx => {
    const i18n  = ctx.chat.i18n.commands.trigger;
    const index = ctx.message.text
        .trim().split(' ').slice(1).join(' ');

    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_in_groups);
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_for_admins);
    if (!/^\d+$/.test(index))
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.trigger_number_is_required);

    const trigger = await db.getTrigger(ctx.chat.id, parseInt(index));
    if (!trigger)
        return ctx.replyWithMarkdown(i18n.responses.not_found);

    await invoke(ctx, trigger);
};
