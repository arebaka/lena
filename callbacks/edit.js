const Markup = require("telegraf").Markup;

const db = require("../db");

module.exports = async (ctx, data) => {
    if (!/^\d+$/.test(data[1]))
        return ctx.answerCbQuery(ctx.chat._.errors.trigger_number_is_required, true);

    const index = parseInt(data[1]);
    const prop  = data[2];
    const value = data[3];

    let   markup;
    let   _       = ctx.chat._.commands.edit;
    const trigger = await db.getTrigger(ctx.chat.id, index);

    if (!trigger)
        return ctx.answerCbQuery(ctx.chat._.callbacks.edit.responses.not_found);
    if (ctx.chat.type != "private" && !ctx.from.isAdmin && ctx.from.id != trigger.creator_id)
        return ctx.answerCbQuery(ctx.chat._.errors.command_only_for_admins, true);

    if (prop) {
        markup = ctx.update.callback_query.message.reply_markup;

        switch (prop) {
            case "reply":
            case "full_factor":
            case "strict_case":
                await db.setTriggerProp(ctx.chat.id, index, prop, value == "on");

                markup.inline_keyboard.find(b => b[0].callback_data.includes(prop))[0] = Markup.button.callback(
                    _.buttons[prop].replace("{indicator}", _.indicators[value]),
                    `edit:${index}:${prop}:${value == "on" ? "off" : "on"}`);

                return ctx.editMessageReplyMarkup(markup);
            case "auto_delete":
                _ = ctx.chat._.commands.auto_delete;

                markup = Markup.inlineKeyboard([
                    [ 0          ],
                    [ 2,    5    ],
                    [ 10,   20   ],
                    [ 60,   300  ],
                    [ 1200, 3600 ]
                ].map(row => row.map(
                    delay => Markup.button.callback(_.variants[delay], `auto_delete:${index}:${delay}`)
                )));

                return ctx.editMessageText(_.text, markup)
            case "done":
                return ctx.editMessageText(_.done);
            default:
                return ctx.answerCbQuery(ctx.chat._.errors.unknown_callback, true);
        }
    }
    else if (trigger.action) {
        markup = Markup.inlineKeyboard([
            [Markup.button.callback(_.buttons.auto_delete, `edit:${trigger.index}:auto_delete`)],
            [Markup.button.callback(_.buttons.done, `edit:${trigger.index}:done`)]
        ]);
    }
    else {
        markup = Markup.inlineKeyboard([
            [Markup.button.callback(
                _.buttons.reply
                    .replace("{indicator}", _.indicators[trigger.reply ? "on" : "off"]),
                `edit:${trigger.index}:reply:${trigger.reply ? "off" : "on"}`
            )],
            [Markup.button.callback(
                _.buttons.full_factor
                    .replace("{indicator}", _.indicators[trigger.full_factor ? "on" : "off"]),
                `edit:${trigger.index}:full_factor:${trigger.full_factor ? "off" : "on"}`
            )],
            [Markup.button.callback(
                _.buttons.strict_case
                    .replace("{indicator}", _.indicators[trigger.strict_case ? "on" : "off"]),
                `edit:${trigger.index}:strict_case:${trigger.strict_case ? "off" : "on"}`
            )],

            [Markup.button.callback(_.buttons.auto_delete, `edit:${trigger.index}:auto_delete`)],

            [Markup.button.callback(_.buttons.done, `edit:${trigger.index}:done`)]
        ]);
    }

    ctx.editMessageText(_.text
            .replace("{index}", index)
            .replace("{factor}", trigger.factor),
        markup);
};
