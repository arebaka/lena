const db     = require("../db");
const invoke = require("../invoke");

module.exports = async ctx => {
	const text = ctx.message.text
		.trim().split(/\s+/g).join(' ');

	const chat     = await db.getChat(ctx.chat.id);
	const triggers = await db.findTriggers(ctx.chat.id, text, text.toLowerCase());

	for (let trigger of triggers) {
		trigger = await db.getTrigger(ctx.chat.id, trigger);
		await invoke(ctx, trigger);
	}
};
