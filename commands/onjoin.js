const bind = require("../bind");

module.exports = async ctx => {
    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown("Команда доступна только в группах!");
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown("Команда доступна только админам!");
    if (!ctx.message.reply_to_message)
        return ctx.replyWithMarkdown("Командой необходимо ответить на сообщение!");

    const trigger = await bind(ctx.message.reply_to_message, true, "join");

    ctx.replyWithMarkdown(trigger
        ? `Триггер ${trigger.index} добавлен.`
        : "Невозможно добавить триггер!"
    );
};
