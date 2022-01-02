const db = require("./db");

module.exports = async (mess, creatorId, action, factor, fullFactor=false, strictCase=false, autoDelete=0, reply=false) => {
	let trigger;

	if (mess.text) {
		trigger = await db.addTextTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply, mess.text
		);
	}
	else if (mess.animation) {
		trigger = await db.addFileTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			"animation", mess.animation.file_id, mess.caption
		);
	}
	else if (mess.audio) {
		trigger = await db.addFileTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			"audio", mess.audio.file_id, mess.caption
		);
	}
	else if (mess.dice) {
		trigger = await db.addDiceTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply, mess.dice.emoji
		);
	}
	else if (mess.document) {
		trigger = await db.addFileTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			"document", mess.document.file_id, mess.caption
		);
	}
	else if (mess.location) {
		trigger = await db.addLocationTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			mess.location.latitude, mess.location.longitude
		);
	}
	else if (mess.photo) {
		const photo = mess.photo.pop();
		trigger     = await db.addFileTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			"photo", photo.file_id, mess.caption
		);
	}
	else if (mess.poll && mess.poll.type == "regular") {
		trigger = await db.addPollTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			mess.poll.type, mess.poll.question, mess.poll.is_anonymous,
			mess.poll.allows_multiple_answers, mess.poll.options.map(o => o.text)
		);
	}
	else if (mess.sticker) {
		trigger = await db.addFileTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			"sticker", mess.sticker.file_id, mess.caption
		);
	}
	else if (mess.video) {
		trigger = await db.addFileTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			"video", mess.video.file_id, mess.caption
		);
	}
	else if (mess.video_note) {
		trigger = await db.addFileTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			"videonote", mess.video_note.file_id, mess.caption
		);
	}
	else if (mess.voice) {
		trigger = await db.addFileTrigger(
			mess.chat.id, creatorId, action, factor, fullFactor, strictCase, autoDelete, reply,
			"voice", mess.voice.file_id, mess.caption
		);
	}

	mess.entities && mess.entities.length
		? await db.addEntities(trigger.id, mess.entities) : null;

	return trigger;
};
