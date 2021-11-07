const db   = require("../db");
const i18n = require("../i18n");

module.exports = async (ctx, data) => {
    if (!ctx.from.isAdmin)
        return ctx.answerCbQuery(ctx.chat.i18n.errors.command_only_for_admins, true);
    if (!i18n[data[1]])
        return ctx.answerCbQuery(ctx.chat.i18n.callbacks.lang.errors.no_lang, true);

    await db.updateChatProp(ctx.chat.id, "lang", data[1]);
    ctx.chat.i18n = i18n[data[1]];

    ctx.editMessageText(ctx.chat.i18n.commands.start.responses.ok
        .replace("{name}",     ctx.chat.i18n.name)
        .replace("{commands}", ctx.chat.i18n.list_of_commands));
};
