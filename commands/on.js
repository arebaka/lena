const db   = require("../db");
const bind = require("../bind");

const FACTOR_MAX_LENGTH = 255;

module.exports = async ctx => {
    const _          = ctx.chat._.commands.on;
    const chat       = await db.getChat(ctx.chat.id);
    let   fullFactor = false;
    let   factor     = ctx.message.text
        .trim().split(' ').slice(1).join(' ');

    if (ctx.chat.type != "private" && !ctx.from.isAdmin && chat.only_admins)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);
    if (!ctx.message.reply_to_message)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_needs_to_reply);
    if (!factor)
        return ctx.replyWithMarkdown(_.responses.factor_is_required);
    if (factor.length > FACTOR_MAX_LENGTH)
        return ctx.replyWithMarkdown(_.responses.factor_is_too_long
            .replace("{length}", FACTOR_MAX_LENGTH
        ));

    if (factor.length > 1 && factor.startsWith('"') && factor.endsWith('"')) {
        factor     = factor.substring(1, factor.length - 1);
        fullFactor = true;
    }

    const trigger = await bind(ctx.message.reply_to_message, ctx.from.id, false, factor, fullFactor);

    ctx.replyWithMarkdown(trigger
        ? _.responses.ok.replace("{index}", trigger.index)
        : _.responses.cannot
    );
}
