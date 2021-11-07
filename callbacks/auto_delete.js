const { Markup } = require("telegraf");

const db = require("../db");

module.exports = async (ctx, data) => {
    if (!/^\d+$/.test(data[1]))
        return ctx.answerCbQuery(ctx.chat._.errors.trigger_number_is_required, true);

    const index = parseInt(data[1]);
    const value = parseInt(data[2]);

    let _ = ctx.chat._.callbacks.auto_delete;

    if (![0, 2, 5, 10, 20, 60, 300, 1200, 3600].includes(value))
        return ctx.answerCbQuery(_.responses.invalid_value, true);

    const trigger = await db.getTrigger(ctx.chat.id, index);

    if (!trigger)
        return ctx.answerCbQuery(_.responses.not_found);
    if (ctx.chat.type != "private" && !ctx.from.isAdmin && ctx.from.id != trigger.creator_id)
        return ctx.answerCbQuery(ctx.chat._.errors.command_only_for_admins, true);

    await db.updateTriggerProp(ctx.chat.id, index, "auto_delete", value);

    ctx.editMessageText(_.responses.ok);
};
