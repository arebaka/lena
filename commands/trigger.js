const db     = require("../db");
const invoke = require("../invoke");

module.exports = async ctx => {
    const _     = ctx.chat._.commands.trigger;
    const chat  = await db.getChat(ctx.chat.id);
    const index = ctx.message.text
        .trim().split(/\s+/).slice(1).join(' ');

    if (ctx.chat.type != "private" && !ctx.from.isAdmin && chat.only_admins)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);
    if (!/^\d+$/.test(index))
        return ctx.replyWithMarkdown(ctx.chat._.errors.trigger_number_is_required);

    const trigger = await db.getTrigger(ctx.chat.id, parseInt(index));
    if (!trigger)
        return ctx.replyWithMarkdown(_.responses.not_found);

    await invoke(ctx, trigger);
};
