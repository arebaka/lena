module.exports = async (ctx, trigger) => {
    let mess;

    switch (trigger.type) {
        case "text":
            mess = ctx.reply(trigger.text, {
                entities: trigger.entities
            });
        break;
        case "animation":
            mess = ctx.replyWithAnimation(trigger.fileid, {
                caption:          trigger.caption,
                caption_entities: trigger.entities
            });
        break;
        case "audio":
            mess = ctx.replyWithAudio(trigger.fileid, {
                caption:          trigger.caption,
                caption_entities: trigger.entities
            });
        break;
        case "dice":
            mess = ctx.replyWithDice(trigger.emoji);
        break;
        case "document":
            mess = ctx.replyWithDocument(trigger.fileid, {
                caption:          trigger.caption,
                caption_entities: trigger.entities
            });
        break;
        case "location":
            mess = ctx.replyWithLocation(trigger.latitude, trigger.longitude);
        break;
        case "photo":
            mess = ctx.replyWithPhoto(trigger.fileid, {
                caption:          trigger.caption,
                caption_entities: trigger.entities
            });
        break;
        case "poll":
            mess = ctx.replyWithPoll(trigger.question, trigger.options);
        break;
        case "sticker":
            mess = ctx.replyWithSticker(trigger.fileid, {
                caption:          trigger.caption,
                caption_entities: trigger.entities
            });
        break;
        case "video":
            mess = ctx.replyWithVideo(trigger.fileid, {
                caption:          trigger.caption,
                caption_entities: trigger.entities
            });
        break;
        case "videonote":
            mess = ctx.replyWithVideoNote(trigger.fileid, {
                caption:          trigger.caption,
                caption_entities: trigger.entities
            });
        break;
        case "voice":
            mess = ctx.replyWithVoice(trigger.fileid, {
                caption:          trigger.caption,
                caption_entities: trigger.entities
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
