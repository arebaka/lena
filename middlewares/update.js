const db     = require("../db");
const i18n   = require("../i18n");
const logger = require("../logger");

module.exports = async (ctx, next) => {
    try {
        ctx.from && await db.setUser(
            ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name);

        if (ctx.chat) {
            const lang = await db.setChat(
                ctx.chat.id, ctx.chat.username,
                ctx.chat.title || ctx.chat.first_name
            );
            ctx.chat._ = i18n[lang];

            if (ctx.chat.type != "private") {
                await ctx.getChatAdministrators()
                    .then(admins => {
                        ctx.chat.admins  = admins;
                        ctx.from.isAdmin = admins.some(admin => admin.user.id == ctx.from.id);
                    })
                    .catch(err => {});
            }
        }
        else {
            ctx.chat = { _: i18n.eng };
        }

        await next();
    }
    catch (err) {
        logger.error(err);
    }
};
