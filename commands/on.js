const bind = require("../bind");

module.exports = async ctx => {
    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown("Команда доступна только в группах!");
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown("Команда доступна только админам!");
    if (!ctx.message.reply_to_message)
        return ctx.replyWithMarkdown("Командой необходимо ответить на сообщение!");

    let fullFactor = false;
    let factor     = ctx.message.text
        .trim().toLowerCase().split(' ').slice(1).join(' ');

    if (!factor)
        return ctx.replyWithMarkdown("Необходимо прописать фактор!");
    if (factor.length > 255)
        return ctx.replyWithMarkdown("Фактор не может превышать длину 255 символов!");

    if (factor.length > 1 && factor.startsWith('"') && factor.endsWith('"')) {
        factor     = factor.substring(1, factor.length - 1);
        fullFactor = true;
    }

    const trigger = await bind(ctx.message.reply_to_message, false, factor, fullFactor);

    ctx.replyWithMarkdown(trigger
        ? `Триггер ${trigger.index} добавлен.`
        : "Невозможно добавить триггер!"
    );
}
