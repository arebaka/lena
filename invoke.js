module.exports = async (ctx, trigger) => {
    switch (trigger.type) {
    case "text":
        ctx.reply(trigger.text, { entities: trigger.entities });
    break;
    case "animation":
        ctx.replyWithAnimation(trigger.fileid, {
            caption: trigger.caption, caption_entities: trigger.entities
        });
    break;
    case "audio":
        ctx.replyWithAudio(trigger.fileid, {
            caption: trigger.caption, caption_entities: trigger.entities
        });
    break;
    case "dice":
        ctx.replyWithDice(trigger.emoji);
    break;
    case "document":
        ctx.replyWithDocument(trigger.fileid, {
            caption: trigger.caption, caption_entities: trigger.entities
        });
    break;
    case "location":
        ctx.replyWithLocation(trigger.latitude, trigger.longitude);
    break;
    case "photo":
        ctx.replyWithPhoto(trigger.fileid, {
            caption: trigger.caption, caption_entities: trigger.entities
        });
    break;
    case "poll":
        ctx.replyWithPoll(trigger.question, trigger.options);
    break;
    case "sticker":
        ctx.replyWithSticker(trigger.fileid, {
            caption: trigger.caption, caption_entities: trigger.entities
        });
    break;
    case "video":
        ctx.replyWithVideo(trigger.fileid, {
            caption: trigger.caption, caption_entities: trigger.entities
        });
    break;
    case "videonote":
        ctx.replyWithVideoNote(trigger.fileid, {
            caption: trigger.caption, caption_entities: trigger.entities
        });
    break;
    case "voice":
        ctx.replyWithVoice(trigger.fileid, {
            caption: trigger.caption, caption_entities: trigger.entities
        });
    break;
    }
};
