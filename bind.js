const db = require("./db");

module.exports = async (mess, creatorId, action, factor, fullFactor=false, strictCase=false, autoDelete=0, reply=false) => {
	let method;
	let args = [];

	if (mess.text) {
		method = "addTextTrigger"
		args   = [mess.text];
	}
	else if (mess.animation) {
		method = "addFileTrigger"
		args   = ["animation", mess.animation.file_id, mess.caption];
	}
	else if (mess.audio) {
		method = "addFileTrigger"
		args   = ["audio", mess.audio.file_id, mess.caption];
	}
	else if (mess.dice) {
		method = "addDiceTrigger"
		args   = [mess.dice.emoji];
	}
	else if (mess.document) {
		method = "addFileTrigger"
		args   = ["document", mess.document.file_id, mess.caption];
	}
	else if (mess.location) {
		method = "addLocationTrigger"
		args   = [mess.location.latitude, mess.location.longitude];
	}
	else if (mess.photo) {
		const photo = mess.photo.pop();

		method = "addFileTrigger"
		args   = ["photo", photo.file_id, mess.caption];
	}
	else if (mess.poll && mess.poll.type == "regular") {
		method = "addPollTrigger"
		args   = [
			mess.poll.type, mess.poll.question, mess.poll.is_anonymous,
			mess.poll.allows_multiple_answers, mess.poll.options.map(o => o.text)
		];
	}
	else if (mess.sticker) {
		method = "addFileTrigger"
		args   = ["sticker", mess.sticker.file_id, mess.caption];
	}
	else if (mess.video) {
		method = "addFileTrigger"
		args   = ["video", mess.video.file_id, mess.caption];
	}
	else if (mess.video_note) {
		method = "addFileTrigger"
		args   = ["videonote", mess.video_note.file_id, mess.caption];
	}
	else if (mess.voice) {
		method = "addFileTrigger"
		args   = ["voice", mess.voice.file_id, mess.caption];
	}

	const trigger = await db[method](mess.chat.id, creatorId, action,
		factor, fullFactor, strictCase, autoDelete, reply, ...args);

	mess.entities && mess.entities.length
		&& await db.addEntities(trigger.id, mess.entities);

	return trigger;
};
