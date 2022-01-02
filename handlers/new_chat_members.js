const db     = require("../db");
const invoke = require("../invoke");

module.exports = async ctx => {
	const triggers = await db.getActionTriggers(ctx.chat.id, "join");

	for (let trigger of triggers) {
		trigger = await db.getTrigger(ctx.chat.id, trigger);
		await invoke(ctx, trigger);
	}
};
