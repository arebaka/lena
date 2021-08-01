const db = require("./db");

module.exports = async (mess, action, factor, fullFactor=false) => {
    let trigger;

    if (mess.text) {
        trigger = await db.addTextTrigger(
            mess.chat.id, action, factor, fullFactor, mess.text
        );
    }
    else if (mess.animation) {
        trigger = await db.addFileTrigger(
            mess.chat.id, action, factor, fullFactor, "animation", mess.animation.file_id, mess.caption
        );
    }
    else if (mess.audio) {
        trigger = await db.addFileTrigger(
            mess.chat.id, action, factor, fullFactor, "audio", mess.audio.file_id, mess.caption
        );
    }
    else if (mess.dice) {
        trigger = await db.addDiceTrigger(
            mess.chat.id, action, factor, fullFactor, mess.dice.emoji
        );
    }
    else if (mess.document) {
        trigger = await db.addFileTrigger(
            mess.chat.id, action, factor, fullFactor, "document", mess.document.file_id, mess.caption
        );
    }
    else if (mess.location) {
        trigger = await db.addLocationTrigger(
            mess.chat.id, action, factor, fullFactor, mess.location.latitude, mess.location.longitude
        );
    }
    else if (mess.photo) {
        const photo = mess.photo.pop();
        trigger     = await db.addFileTrigger(
            mess.chat.id, action, factor, fullFactor, "photo", photo.file_id, mess.caption
        );
    }
    else if (mess.poll && mess.poll.type == "regular") {
        trigger = await db.addPollTrigger(
            mess.chat.id, action, factor, fullFactor, mess.poll.type, mess.poll.question,
            mess.poll.is_anonymous, mess.poll.allows_multiple_answers, mess.poll.options.map(o => o.text)
        );
    }
    else if (mess.sticker) {
        trigger = await db.addFileTrigger(
            mess.chat.id, action, factor, fullFactor, "sticker", mess.sticker.file_id, mess.caption
        );
    }
    else if (mess.video) {
        trigger = await db.addFileTrigger(
            mess.chat.id, action, factor, fullFactor, "video", mess.video.file_id, mess.caption
        );
    }
    else if (mess.video_note) {
        trigger = await db.addFileTrigger(
            mess.chat.id, action, factor, fullFactor, "videonote", mess.video_note.file_id, mess.caption
        );
    }
    else if (mess.voice) {
        trigger = await db.addFileTrigger(
            mess.chat.id, action, factor, fullFactor, "voice", mess.voice.file_id, mess.caption
        );
    }

    if (mess.entities && mess.entities.length) {
        await db.addEntities(trigger.id, mess.entities);
    }

    return trigger;
};
