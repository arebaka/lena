const db = require("../db");

module.exports = async ctx => {
    const index = ctx.message.text
        .trim().split(' ').slice(1).join(' ');

    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown("Команда доступна только в группах!");
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown("Команда доступна только админам!");
    if (!/^\d+$/.test(index))
        return ctx.replyWithMarkdown("Необходимо указать номер триггера!");

    const trigger = await db.remTrigger(ctx.chat.id, parseInt(index));

    ctx.replyWithMarkdown(trigger
        ? `Триггер ${trigger.index} удалён.`
        : "Триггер не найден!"
    );
};
