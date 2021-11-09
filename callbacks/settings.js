const Markup = require("telegraf").Markup;

const db = require("../db");

async function settingTrigger(ctx, data)
{
    if (!/^\d+$/.test(data[1]))
        return ctx.answerCbQuery(ctx.chat._.errors.trigger_number_is_required, true);

    const index = parseInt(data[1]);
    const prop  = data[2];
    const value = data[3];

    let _      = ctx.chat._.commands.settings.trigger;
    let markup = ctx.update.callback_query.message.reply_markup;

    const trigger = await db.getTrigger(ctx.chat.id, index);

    if (!trigger)
        return ctx.answerCbQuery(ctx.chat._.callbacks.settings.trigger.responses.not_found);
    if (ctx.chat.type != "private" && !ctx.from.isAdmin && ctx.from.id != trigger.creator_id)
        return ctx.answerCbQuery(ctx.chat._.errors.command_only_for_admins, true);

    switch (prop) {
        case "reply":
        case "full_factor":
        case "strict_case":
            await db.setTriggerProp(ctx.chat.id, index, prop, value == "on");

            markup.inline_keyboard.find(b => b[0].callback_data.includes(prop))[0] = Markup.button.callback(
                _.buttons[prop].replace("{indicator}", _.indicators[value]),
                `settings:${index}:${prop}:${value == "on" ? "off" : "on"}`);

            return ctx.editMessageReplyMarkup(markup);
        case "auto_delete":
            _ = ctx.chat._.commands.settings.auto_delete;

            markup = Markup.inlineKeyboard([
                [ 0          ],
                [ 2,    5    ],
                [ 10,   20   ],
                [ 60,   300  ],
                [ 1200, 3600 ]
            ].map(row => row.map(
                delay => Markup.button.callback(_.variants[delay], `auto_delete:${index}:${delay}`)
            )));

            return ctx.editMessageText(_.text, markup)
        case "done":
            return ctx.editMessageText(_.done);
        default:
            return ctx.answerCbQuery(ctx.chat._.errors.unknown_callback, true);
    }
}

async function settingChat(ctx, data)
{
    const prop  = data[1];
    const value = data[2];

    let _      = ctx.chat._.commands.settings.chat;
    let markup = ctx.update.callback_query.message.reply_markup;

    if (ctx.chat.type != "private" && !ctx.from.isAdmin)
        return ctx.answerCbQuery(ctx.chat._.errors.command_only_for_admins, true);

    switch (prop) {
        case "only_admins":
            await db.setChatProp(ctx.chat.id, prop, value == "on");

            markup.inline_keyboard.find(b => b[0].callback_data.includes(prop))[0] = Markup.button.callback(
                _.buttons[prop].replace("{indicator}", _.indicators[value]),
                `settings:${prop}:${value == "on" ? "off" : "on"}`);

            return ctx.editMessageReplyMarkup(markup);
        case "change_lang":
            markup = Markup.inlineKeyboard([
                    Markup.button.callback("English", "lang:eng"),
                    Markup.button.callback("Русский", "lang:rus")
                ]);

            return ctx.editMessageText("Choose the language\nВыберите язык", markup);
        case "done":
            return ctx.editMessageText(_.done);
        default:
            return ctx.answerCbQuery(ctx.chat._.errors.unknown_callback, true);
    }
}

module.exports = async (ctx, data) => {
    await /^\d+$/.test(data[1]) ? settingTrigger(ctx, data) : settingChat(ctx, data);
};
