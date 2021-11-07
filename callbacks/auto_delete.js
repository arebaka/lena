const { Markup } = require("telegraf");

const db = require("../db");

module.exports = async (ctx, data) => {
    if (ctx.chat.type != "private" && !ctx.from.isAdmin)
        return ctx.answerCbQuery(ctx.chat._.errors.command_only_for_admins, true);

    const index = parseInt(data[1]);
    const value = parseInt(data[2]);

    if (![0, 2, 5, 10, 20, 60, 300, 1200, 3600].includes(value))
        return ctx.answerCbQuery(_.responses.invalid_value, true);

    let _ = ctx.chat._.callbacks.auto_delete;

    await db.updateTriggerProp(ctx.chat.id, index, "auto_delete", value);

    ctx.editMessageText(_.responses.ok);
};
