const db = require("../db");

module.exports = async ctx => {
    const i18n     = ctx.chat.i18n.commands.list;
    const chat     = await db.getChat(ctx.chat.id);
    const triggers = await db.getChatTriggers(ctx.chat.id);
    let   lines    = [];
    let   line;
    let   factor;

    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_in_groups);
    if (!ctx.from.isAdmin && chat.only_admins)
        return ctx.replyWithMarkdown(ctx.chat.i18n.errors.command_only_for_admins);

    for (let trigger of triggers) {
        line = `${trigger.index} ${i18n.emoji[trigger.type]} : `;

        if (trigger.action) {
            switch (trigger.factor) {
            case "join":
                factor = i18n.actions.join;
            break;
            case "left":
                factor = i18n.actions.left;
            break;
            default:
                factor = i18n.actions.default;
            break;
            }
        }
        else {
            factor = trigger.factor.length > 10
                ? trigger.factor.substring(0, 15) + "..."
                : trigger.factor;

            if (trigger.strict_case)
                factor = `*${factor}*`

            if (trigger.full_factor) {
                factor = `"${factor}"`;
            }
        }

        line += factor;

        if (trigger.auto_delete)
            line += ` \`[${i18n.auto_delete[trigger.auto_delete]}]\``

        lines.push(line);
    }

    ctx.replyWithMarkdown(lines.length
        ? lines.join('\n')
        : i18n.responses.no_triggers
    );
};
