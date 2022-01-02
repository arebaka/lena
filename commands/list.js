const db = require("../db");

const MAX_FACTOR_LENGTH = 15;

module.exports = async ctx => {
	const _        = ctx.chat._.commands.list;
	const chat     = await db.getChat(ctx.chat.id);
	const triggers = await db.getChatTriggers(ctx.chat.id);
	let   lines    = [];
	let   line;
	let   factor;

	if (ctx.chat.type != "private" && !ctx.from.isAdmin && chat.only_admins)
		return ctx.replyWithMarkdown(ctx.chat._.errors.command_only_for_admins);

	for (let trigger of triggers) {
		line = `${_.emoji[trigger.type]} ${trigger.index}: `;

		if (trigger.action) {
			switch (trigger.factor) {
				case "join":
					factor = _.actions.join;
				break;
				case "left":
					factor = _.actions.left;
				break;
				default:
					factor = _.actions.default;
				break;
			}

			factor = `_${factor}_`;
		}
		else {
			factor = trigger.factor.length > MAX_FACTOR_LENGTH
				? trigger.factor.substring(0, MAX_FACTOR_LENGTH) + "..."
				: trigger.factor;

			factor = trigger.strict_case ? `*${factor}*` : factor;
			factor = trigger.full_factor ? `"${factor}"` : factor;
		}

		line += factor;
		line += trigger.auto_delete ? ` \`[${_.auto_delete[trigger.auto_delete]}]\`` : "";

		lines.push(line);
	}

	ctx.replyWithMarkdown(lines.length
		? lines.join('\n')
		: _.responses.no_triggers
	);
};
