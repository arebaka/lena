const db = require("../db");

const triggerTypeEmojis = {
    text:      "📃",
    animation: "📹",
    audio:     "🎧",
    dice:      "🎲",
    document:  "🏷️",
    game:      "🎮",
    invoice:   "💳",
    location:  "🌐",
    photo:     "🖼️",
    poll:      "📊",
    quiz:      "🍀",
    sticker:   "😽",
    video:     "🎬",
    videonote: "🎥",
    voice:     "🎤"
};

module.exports = async ctx => {
    if (ctx.chat.type == "private")
        return ctx.replyWithMarkdown("Команда доступна только в группах!");
    if (!ctx.from.isAdmin)
        return ctx.replyWithMarkdown("Команда доступна только админам!");

    const triggers = await db.getChatTriggers(ctx.chat.id);
    let   lines = [];
    let   line;
    let   factor;

    for (let trigger of triggers) {
        line = `${trigger.index} ${triggerTypeEmojis[trigger.type]} : `;

        if (trigger.action) {
            switch (trigger.factor) {
            case "join":
                factor = "_заход в чат_";
            break;
            case "left":
                factor = "_выход из чата_";
            break;
            default:
                factor = "_действие_";
            break;
            }
        }
        else {
            factor = trigger.factor.length > 10
                ? trigger.factor.substring(0, 10) + "..."
                : trigger.factor;

            if (trigger.full_factor) {
                factor = `"${factor}"`;
            }
        }

        line += factor;
        lines.push(line);
    }

    ctx.replyWithMarkdown(lines.length
        ? lines.join('\n')
        : "В этом чате не задано ни одного триггера!"
    );
};
