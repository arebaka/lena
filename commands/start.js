const Markup = require("telegraf").Markup;

module.exports = async ctx => {
    const markup = Markup.inlineKeyboard([
            Markup.button.callback("English", "lang:eng"),
            Markup.button.callback("Русский", "lang:rus")
        ]);

    ctx.replyWithMarkdown("Choose the language\nВыберите язык", markup);
};
