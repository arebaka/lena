function substitute(ctx, text, entities)
{
    /*
    {user}
    {name}
    {mention}
    {username}
    {id}
    {date}
    {time}
    {datetime}
    {message}
    */

    return { text, entities };
}

module.exports = async (ctx, trigger) => {
    const content = trigger.entities
        ? substitute(ctx, trigger.text || trigger.caption, trigger.entities) : null;

    let mess;

    switch (trigger.type) {
        case "text":
            mess = ctx.reply(content.text, {
                reply_to_message_id: trigger.reply ? ctx.message.message_id : undefined,
                entities:            content.entities
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
                caption:             content.text,
                caption_entities:    content.entities
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
