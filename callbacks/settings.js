const Markup = require("telegraf").Markup;

const db = require("../db");

module.exports = async (ctx, data) => {
    const prop  = data[1];
    const value = data[2];

    let _      = ctx.chat._.commands.settings;
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
};
