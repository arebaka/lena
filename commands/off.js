const db = require("../db");

module.exports = async ctx => {
    const _     = ctx.chat._.commands.off;
    const index = ctx.message.text
        .trim().split(/\s+/).slice(1).join(' ');

    if (!/^\d+$/.test(index))
        return ctx.replyWithMarkdown(ctx.chat._.errors.trigger_number_is_required);

    const trigger = await db.getTrigger(ctx.chat.id, parseInt(index));

    if (!trigger)
        return ctx.replyWithMarkdown(_.responses.not_found);
    if (ctx.chat.type != "private" && !ctx.from.isAdmin && ctx.from.id != trigger.creator_id)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);

    await db.remTrigger(ctx.chat.id, parseInt(index));

    ctx.replyWithMarkdown(_.responses.ok.replace("{index}", trigger.index));
};
