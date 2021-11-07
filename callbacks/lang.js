const db   = require("../db");
const i18n = require("../i18n");

module.exports = async (ctx, data) => {
    if (ctx.chat.type != "private" && !ctx.from.isAdmin)
        return ctx.answerCbQuery(ctx.chat._.errors.command_only_for_admins, true);
    if (!i18n[data[1]])
        return ctx.answerCbQuery(ctx.chat._.callbacks.lang.responses.no_lang, true);

    await db.updateChatProp(ctx.chat.id, "lang", data[1]);
    ctx.chat._ = i18n[data[1]];

    ctx.editMessageText(ctx.chat._.commands.start.responses.ok
        .replace("{name}",     ctx.chat._.name)
        .replace("{commands}", ctx.chat._.list_of_commands));
};
