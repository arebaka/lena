const { Markup } = require("telegraf");

const db = require("../db");

async function settingTrigger(ctx, data)
{
    const index = parseInt(data[1]);
    const prop  = data[2];
    const value = data[3];

    let _      = ctx.chat.i18n.commands.settings.trigger;
    let markup = ctx.update.callback_query.message.reply_markup;

    switch (prop) {
        case "full_factor":
        case "strict_case":
            await db.updateTriggerProp(ctx.chat.id, index, prop, value == "on");

            markup.inline_keyboard.find(b => b[0].callback_data.includes(prop))[0] = Markup.button.callback(
                _.buttons[prop].replace("{indicator}", _.indicators[value]),
                `settings:${index}:${prop}:${value == "on" ? "off" : "on"}`);

            return ctx.editMessageReplyMarkup(markup);
        case "auto_delete":
            _ = ctx.chat.i18n.callbacks.auto_delete;

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
            return ctx.answerCbQuery(ctx.chat.i18n.errors.unknown_callback, true);
    }
}

async function settingChat(ctx, data)
{
    const prop  = data[1];
    const value = data[2];

    let _      = ctx.chat.i18n.commands.settings.chat;
    let markup = ctx.update.callback_query.message.reply_markup;

    switch (prop) {
        case "only_admins":
            await db.updateChatProp(ctx.chat.id, prop, value == "on");

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
            return ctx.answerCbQuery(ctx.chat.i18n.errors.unknown_callback, true);   
    }
}

module.exports = async (ctx, data) => {
    if (!ctx.from.isAdmin)
        return ctx.answerCbQuery(ctx.chat.i18n.errors.command_only_for_admins, true);

    await /^\d+$/.test(data[1]) ? settingTrigger(ctx, data) : settingChat(ctx, data);
};
