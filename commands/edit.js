const Markup = require("telegraf").Markup;

const db = require("../db");

module.exports = async ctx => {
    let   markup;
    let   _     = ctx.chat._.commands.edit;
    const index = ctx.message.text
        .trim().split(/\s/).slice(1).join(' ');

    if (!/^\d+$/.test(index))
        return ctx.replyWithMarkdown(ctx.chat._.errors.trigger_number_is_required);

    const trigger = await db.getTrigger(ctx.chat.id, parseInt(index));

    if (!trigger)
        return ctx.replyWithMarkdown(_.responses.not_found);
    if (ctx.chat.type != "private" && !ctx.from.isAdmin && ctx.from.id != trigger.creator_id)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);

    if (trigger.action) {
        markup = Markup.inlineKeyboard([
            [Markup.button.callback(_.buttons.auto_delete, `edit:${trigger.index}:auto_delete`)],
            [Markup.button.callback(_.buttons.done, `edit:${trigger.index}:done`)]
        ]);
    }
    else {
        markup = Markup.inlineKeyboard([
            [Markup.button.callback(
                _.buttons.reply
                    .replace("{indicator}", _.indicators[trigger.reply ? "on" : "off"]),
                `edit:${trigger.index}:reply:${trigger.reply ? "off" : "on"}`
            )],
            [Markup.button.callback(
                _.buttons.full_factor
                    .replace("{indicator}", _.indicators[trigger.full_factor ? "on" : "off"]),
                `edit:${trigger.index}:full_factor:${trigger.full_factor ? "off" : "on"}`
            )],
            [Markup.button.callback(
                _.buttons.strict_case
                    .replace("{indicator}", _.indicators[trigger.strict_case ? "on" : "off"]),
                `edit:${trigger.index}:strict_case:${trigger.strict_case ? "off" : "on"}`
            )],

            [Markup.button.callback(_.buttons.auto_delete, `edit:${trigger.index}:auto_delete`)],

            [Markup.button.callback(_.buttons.done, `edit:${trigger.index}:done`)]
        ]);
    }

    ctx.replyWithMarkdown(
        _.text
            .replace("{index}", index)
            .replace("{factor}", trigger.factor),
        markup);
};
