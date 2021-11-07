const { Markup } = require("telegraf");

const db = require("../db");

module.exports = async ctx => {
    let   markup;
    let   i18n  = ctx.chat.i18n.commands.settings;
    const index = ctx.message.text
        .trim().split(' ').slice(1).join(' ');

    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_in_groups);
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_for_admins);

    if (index) {
        if (!/^\d+$/.test(index))
            return ctx.replyWithMarkdown(ctx.chat.i18n.errors.trigger_number_is_required);

        i18n = i18n.trigger;

        const trigger = await db.getTrigger(ctx.chat.id, parseInt(index));
        if (!trigger)
            return ctx.replyWithMarkdown(i18n.responses.not_found);

        if (trigger.action) {
            markup = Markup.inlineKeyboard([
                [Markup.button.callback(i18n.buttons.auto_delete, `settings:${trigger.index}:auto_delete`)],
                [Markup.button.callback(i18n.buttons.done, `settings:${trigger.index}:done`)]
            ]);
        }
        else {
            markup = Markup.inlineKeyboard([
                [Markup.button.callback(
                    i18n.buttons.full_factor
                        .replace("{indicator}", i18n.indicators[trigger.full_factor ? "on" : "off"]),
                    `settings:${trigger.index}:full_factor:${trigger.full_factor ? "off" : "on"}`
                )],
                [Markup.button.callback(
                    i18n.buttons.strict_case
                        .replace("{indicator}", i18n.indicators[trigger.strict_case ? "on" : "off"]),
                    `settings:${trigger.index}:strict_case:${trigger.strict_case ? "off" : "on"}`
                )],

                [Markup.button.callback(i18n.buttons.auto_delete, `settings:${trigger.index}:auto_delete`)],

                [Markup.button.callback(i18n.buttons.done, `settings:${trigger.index}:done`)]
            ]);
        }

        return ctx.replyWithMarkdown(i18n.text.replace("{index}", index), markup);
    }

    i18n = i18n.chat;

    const chat = await db.getChat(ctx.chat.id);

    markup = Markup.inlineKeyboard([
        [Markup.button.callback(
            i18n.buttons.only_admins
                .replace("{indicator}", i18n.indicators[chat.only_admins ? "on" : "off"]),
            `settings:only_admins:${chat.only_admins ? "off" : "on"}`
        )],

        [Markup.button.callback(i18n.buttons.change_lang, "settings:change_lang")],

        [Markup.button.callback(i18n.buttons.done, "settings:done")]
    ]);

    ctx.replyWithMarkdown(i18n.text, markup);
};
