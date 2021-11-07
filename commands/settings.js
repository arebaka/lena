const { Markup } = require("telegraf");

const db = require("../db");

module.exports = async ctx => {
    let   markup;
    let   _     = ctx.chat._.commands.settings;
    const index = ctx.message.text
        .trim().split(' ').slice(1).join(' ');

    if (ctx.chat.type != "private" && !ctx.from.isAdmin)
        return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);

    if (index) {
        if (!/^\d+$/.test(index))
            return ctx.replyWithMarkdown(ctx.chat._.errors.trigger_number_is_required);

        _ = _.trigger;

        const trigger = await db.getTrigger(ctx.chat.id, parseInt(index));
        if (!trigger)
            return ctx.replyWithMarkdown(_.responses.not_found);

        if (trigger.action) {
            markup = Markup.inlineKeyboard([
                [Markup.button.callback(_.buttons.auto_delete, `settings:${trigger.index}:auto_delete`)],
                [Markup.button.callback(_.buttons.done, `settings:${trigger.index}:done`)]
            ]);

            return ctx.replyWithMarkdown(_.text_action.replace("{index}", index), markup);
        }

        markup = Markup.inlineKeyboard([
            [Markup.button.callback(
                _.buttons.full_factor
                    .replace("{indicator}", _.indicators[trigger.full_factor ? "on" : "off"]),
                `settings:${trigger.index}:full_factor:${trigger.full_factor ? "off" : "on"}`
            )],
            [Markup.button.callback(
                _.buttons.strict_case
                    .replace("{indicator}", _.indicators[trigger.strict_case ? "on" : "off"]),
                `settings:${trigger.index}:strict_case:${trigger.strict_case ? "off" : "on"}`
            )],

            [Markup.button.callback(_.buttons.auto_delete, `settings:${trigger.index}:auto_delete`)],

            [Markup.button.callback(_.buttons.done, `settings:${trigger.index}:done`)]
        ]);

        return ctx.replyWithMarkdown(
            _.text
                .replace("{index}", index)
                .replace("{factor}", trigger.factor),
            markup);
    }

    _ = _.chat;

    const chat = await db.getChat(ctx.chat.id);

    markup = Markup.inlineKeyboard([
        [Markup.button.callback(
            _.buttons.only_admins
                .replace("{indicator}", _.indicators[chat.only_admins ? "on" : "off"]),
            `settings:only_admins:${chat.only_admins ? "off" : "on"}`
        )],

        [Markup.button.callback(_.buttons.change_lang, "settings:change_lang")],

        [Markup.button.callback(_.buttons.done, "settings:done")]
    ]);

    ctx.replyWithMarkdown(_.text, markup);
};
