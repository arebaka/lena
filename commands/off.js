const db = require("../db");

module.exports = async ctx => {
    const _     = ctx.chat._.commands.off;
    const index = ctx.message.text
        .trim().split(' ').slice(1).join(' ');

    if (ctx.chat.type != "private" && !ctx.from.isAdmin)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);
    if (!/^\d+$/.test(index))
        return ctx.replyWithMarkdown(ctx.chat._.errors.trigger_number_is_required);

    const trigger = await db.remTrigger(ctx.chat.id, parseInt(index));

    ctx.replyWithMarkdown(trigger
        ? _.responses.ok.replace("{index}", trigger.index)
        : _.responses.not_found
    );
};
