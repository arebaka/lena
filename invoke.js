function substitute(ctx, text, entities)
{
    let chars = [...text];
    let res   = "";
    let stack = [];
    let tag;

    for (let i = 0; i < chars.length; i++) {
        for (let entity of entities.filter(e => e.offset + e.length == i)) {
            tag = {
                bold:         "</b>",
                italic:       "</i>",
                underline:    "</u>",
                striketrough: "</s>",
                code:         "</code>",
                pre:          "</pre>",
                mention:      "",
                url:          "",
                text_link:    "</a>"
            }[stack.pop()];

            res += tag;
        }

        for (let entity of entities.filter(e => e.offset == i)) {
            tag = {
                bold:         "<b>",
                italic:       "<i>",
                underline:    "<u>",
                striketrough: "<s>",
                code:         "<code>",
                pre:          "<pre>",
                mention:      "",
                url:          "",
                text_link:    `<a href="${entity.url}">`
            }[entity.type];

            stack.push(entity.type);
            res += tag;
        }

        if (chars[i] == '&') chars[i] = '&amp;';
        if (chars[i] == '<') chars[i] = '&lt;';
        if (chars[i] == '<') chars[i] = '&gt;';

        res += chars[i];
    }

    res = res.replace(/\{chat\}/g, ctx.chat.title || ctx.from.first_name);
    res = res.replace(/\{chatid\}/g, ctx.chat.id);
    res = res.replace(/\{chatname\}/g, ctx.chat.username || "");

    res = res.replace(/\{name\}/g, ctx.from.first_name);
    res = res.replace(/\{fullname\}/g, ctx.from.first_name + (ctx.from.last_name ? " " + ctx.from.last_name : ""));
    res = res.replace(/\{mention\}/g, `<a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>`);
    res = res.replace(/\{username\}/g, ctx.from.username || "");
    res = res.replace(/\{user\}/g, ctx.from.username
        ? "@" + ctx.from.username
        : `<a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>`);
    res = res.replace(/\{userid\}/g, ctx.from.id);

//    res = res.replace(/\{date\}/g, dateformat(ctx.message.date, ctx.chat._.locale.date));
//    res = res.replace(/\{time\}/g, dateformat(ctx.message.date, ctx.chat._.locale.time));
//    res = res.replace(/\{datetime\}/g, dateformat(ctx.message.date, ctx.chat._.locale.datetime));

    res = res.replace(/\{message\}/g, ctx.message.text);
    res = res.replace(/\{messid\}/g, ctx.message.message_id);

    return res;
}

module.exports = async (ctx, trigger) => {
    const content = substitute(ctx, trigger.text || trigger.caption || "", trigger.entities);
    let   mess;

    switch (trigger.type) {
        case "text":
            mess = ctx.replyWithHTML(content, {
                reply_to_message_id: trigger.reply ? ctx.message.message_id : undefined,
            });
        break;
        case "location":
            mess = ctx.replyWithLocation(trigger.latitude, trigger.longitude, {
                reply_to_message_id: trigger.reply ? ctx.message.message_id : undefined,
            });
        break;
        case "dice":
            mess = ctx.replyWithDice(trigger.emoji, {
                reply_to_message_id: trigger.reply ? ctx.message.message_id : undefined,
            });
        break;
        case "poll":
            mess = ctx.replyWithPoll(trigger.question, trigger.options, {
                reply_to_message_id: trigger.reply ? ctx.message.message_id : undefined,
            });
        break;
        default:
            ctx.method = {
                animation: ctx.replyWithAnimation,
                audio:     ctx.replyWithAudio,
                document:  ctx.replyWithDocument,
                photo:     ctx.replyWithPhoto,
                sticker:   ctx.replyWithSticker,
                video:     ctx.replyWithVideo,
                videonote: ctx.replyWithVideoNote,
                voice:     ctx.replyWithVoice
            }[trigger.type];

            mess = ctx.method(trigger.fileid, {
                reply_to_message_id: trigger.reply ? ctx.message.message_id : undefined,
                caption:             content,
                parse_mode:          "HTML"
            });
        break;
    }

    if (trigger.auto_delete) {
        mess = await mess;

        setTimeout(() => {
            ctx.deleteMessage(mess.message_id);
        }, trigger.auto_delete * 1000);
    }
};
