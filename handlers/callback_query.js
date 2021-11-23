const callbacks = require("../callbacks");

module.exports = async ctx => {
    const query = ctx.update.callback_query;
    const data  = query.data.split(':');

    switch (data[0]) {
        case "lang":        return callbacks.lang(ctx, data);
        case "settings":    return callbacks.settings(ctx, data);
        case "edit":        return callbacks.edit(ctx, data);
        case "auto_delete": return callbacks.autoDelete(ctx, data);
        default:            return ctx.answerCbQuery(ctx.chat._.errors.unknown_callback, true);
    }
};
