const db     = require("../db");
const invoke = require("../invoke");

module.exports = async ctx => {
    const index = ctx.message.text
        .trim().split(' ').slice(1).join(' ');

    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown("Команда доступна только в группах!");
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown("Команда доступна только админам!");
    if (!/^\d+$/.test(index))
        return ctx.replyWithMarkdown("Необходимо указать номер триггера!");

    const trigger = await db.getTrigger(ctx.chat.id, parseInt(index));
    if (!trigger)
        return ctx.replyWithMarkdown("Триггер не найден!");

    await invoke(ctx, trigger);
};
