const path = require("path");
const fs   = require("fs");
const pg   = require("pg");

const config = require("../config");




class DBHelper
{
    async _addTrigger(chatId, action, factor, fullFactor, strictCase, autoDelete, type)
    {
        const index = await this.pool.query(`
                update chats set last_trigger_index = last_trigger_index + 1
                where id = $1
                returning last_trigger_index
            `, [chatId]);

        const trigger = await this.pool.query(`
                insert into triggers
                    (chat_id, index, type, action, factor, full_factor, strict_case, auto_delete)
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                returning id, index, type, action, factor, full_factor, strict_case, auto_delete
            `, [
                chatId, index.rows[0].last_trigger_index, type,
                action, factor, fullFactor, strictCase, autoDelete
            ]);

        return trigger.rows[0];
    }

    constructor()
    {
        this.pool = null;
    }

    async start()
    {
        const sql = fs.readFileSync(path.resolve("db/init.sql"), "utf8").split(';');
        this.pool = new pg.Pool({
            connectionString: config.dbUri,
            max:              1
        });

        this.pool.on("error", async (err, client) => {
            console.error("PostgreSQL pool is down!", err);
            await this.pool.end();
            process.exit(-1);
        });

        for (let query of sql) {
            await this.pool.query(query)
                .catch(err => {});
        }
    }

    async stop()
    {
        await this.pool.end();
    }

    async restart()
    {
        await this.stop();
        await this.start();
    }

    async updateUser(id, username, firstName, lastName)
    {
        await this.pool.query(`
                insert into users (id, username, first_name, last_name)
                values ($1, $2, $3, $4)
                on conflict (id) do update
                set username = $2, first_name = $3, last_name = $4
            `, [
                id, username, firstName, lastName
            ]);
    }

    async updateChat(id, username, title)
    {
        const lang = await this.pool.query(`
                insert into chats (id, username, title)
                values ($1, $2, $3)
                on conflict (id) do update
                set username = $2, title = $3
                returning lang
            `, [
                id, username, title
            ]);

        return lang.rows[0].lang;
    }

    async updateChatProp(id, prop, value)
    {
        await this.pool.query(`
                update chats
                set ${prop} = $1
                where id = $2
            `, [
                value, id
            ]);
    }

    async getChat(chatId)
    {
        const chat = await this.pool.query(`
                select id, username, title, last_trigger_index, lang, only_admins
                from chats
                where id = $1
            `, [chatId]);

        return chat.rows.length ? chat.rows[0] : null;
    }

    async updateTriggerProp(chatId, index, prop, value)
    {
        await this.pool.query(`
                update triggers
                set ${prop} = $1
                where chat_id = $2
                and index = $3
            `, [
                value, chatId, index
            ]);
    }

    async getTrigger(chatId, index)
    {
        let trigger = await this.pool.query(`
                select id, index, type, action, factor, full_factor, strict_case, auto_delete
                from triggers
                where chat_id = $1
                and index = $2
            `, [
                chatId, index
            ]);

        trigger = trigger.rows[0];
        if (!trigger)
            return null;

        switch (trigger.type) {
        case "text":
            const text = await this.pool.query(`
                    select text
                    from text_triggers
                    where trigger_id = $1
                `, [trigger.id]);

            trigger.text = text.rows[0].text;
        break;
        case "animation":
        case "audio":
        case "document":
        case "photo":
        case "sticker":
        case "video":
        case "videonote":
        case "voice":
            let file = await this.pool.query(`
                    select fileid, caption
                    from file_triggers
                    where trigger_id = $1
                `, [trigger.id]);

            file = file.rows[0];
            trigger.fileid  = file.fileid;
            trigger.caption = file.caption;
        break;
        case "dice":
            let dice = await this.pool.query(`
                    select emoji
                    from dice_triggers
                    where trigger_id = $1
                `, [trigger.id]);

            trigger.emoji = dice.rows[0].emoji;
        break;
        case "location":
            let coords = await this.pool.query(`
                    select coords
                    from location_triggers
                    where trigger_id = $1
                `, [trigger.id]);

            coords = coords.rows[0].coords;
            trigger.latitude  = coords.x;
            trigger.longitude = coords.y;
        break;
        case "poll":
            let poll = await this.pool.query(`
                    select id, question, anon, multiple_answers
                    from poll_triggers
                    where trigger_id = $1
                `, [trigger.id]);

            poll = poll.rows[0];
            trigger.question        = poll.question;
            trigger.anon            = poll.anon;
            trigger.multipleAnswers = poll.multiple_answers;

            let options = await this.pool.query(`
                    select text
                    from poll_options
                    where poll_id = $1
                `, [poll.id]);

            trigger.options = options.rows.map(o => o.text);
        break;
        }

        const entities = await this.pool.query(`
                select type, "offset", length
                from entities
                where trigger_id = $1
            `, [trigger.id]);

        trigger.id       = undefined;
        trigger.entities = entities.rows;

        return trigger;
    }

    async getChatTriggers(chatId)
    {
        const triggers = await this.pool.query(`
                select index, type, action, factor, full_factor, strict_case, auto_delete
                from triggers
                where chat_id = $1
            `, [chatId]);

        return triggers.rows;
    }

    async findTriggers(chatId, text, lower)
    {
        const triggers = await this.pool.query(`
                select index
                from triggers
                where chat_id = $1
                and action = false
                and (
                    $2 like '%' || factor || '%'
                    and full_factor = false
                    and strict_case = true
                ) and (
                    $3 like '%' || factor || '%'
                    and full_factor = false
                    and strict_case = false
                ) and (
                    factor = $2
                    and full_factor = true
                    and strict_case = true
                ) and (
                    factor = $3
                    and full_factor = true
                    and strict_case = false
                )
            `, [
                chatId, text, lower
            ]);

        return triggers.rows.map(t => t.index);
    }

    async getActionTriggers(chatId, action)
    {
        const triggers = await this.pool.query(`
                select index
                from triggers
                where chat_id = $1
                and action = true
                and factor = $2
            `, [
                chatId, action
            ]);

        return triggers.rows.map(t => t.index);
    }

    async remTrigger(chatId, index)
    {
        const trigger = await this.pool.query(`
                delete from triggers
                where chat_id =$1
                and index = $2
                returning index, type, action, factor, full_factor
            `, [
                chatId, index
            ]);

        return trigger.rows[0];
    }

    async addEntities(triggerId, entities)
    {
        for (let entity of entities) {
            await this.pool.query(`
                    insert into entities (trigger_id, type, "offset", length)
                    values ($1, $2, $3, $4)
                `, [
                    triggerId, entity.type, entity.offset, entity.length
                ]);
        }
    }

    async addTextTrigger(chatId, action, factor, fullFactor, strictCase, autoDelete, text)
    {
        const trigger = await this._addTrigger(
            chatId, action, factor, fullFactor, strictCase, autoDelete, "text");

        await this.pool.query(`
                insert into text_triggers (trigger_id, text)
                values ($1, $2)
            `, [
                trigger.id, text
            ]);

        return trigger;
    }

    async addFileTrigger(chatId, action, factor, fullFactor, strictCase, autoDelete, type, fileid, caption)
    {
        const trigger = await this._addTrigger(
            chatId, action, factor, fullFactor, strictCase, autoDelete, type);

        await this.pool.query(`
                insert into file_triggers (trigger_id, fileid, caption)
                values ($1, $2, $3)
            `, [
                trigger.id, fileid, caption
            ]);

        return trigger;
    }

    async addDiceTrigger(chatId, action, factor, fullFactor, strictCase, autoDelete, emoji)
    {
        const trigger = await this._addTrigger(
            chatId, action, factor, fullFactor, strictCase, autoDelete, "dice");

        await this.pool.query(`
                insert into dice_triggers (trigger_id, emoji)
                values ($1, $2)
            `, [
                trigger.id, emoji
            ]);

        return trigger;
    }

    async addLocationTrigger(chatId, action, factor, fullFactor, strictCase, autoDelete, latitude, longitude)
    {
        const trigger = await this._addTrigger(
            chatId, action, factor, fullFactor, strictCase, autoDelete, "location");

        await this.pool.query(`
                insert into location_triggers (trigger_id, coords)
                values ($1, point ($2, $3))
            `, [
                trigger.id, latitude, longitude
            ]);

        return trigger;
    }

    async addPollTrigger(
        chatId, action, factor, fullFactor, strictCase, autoDelete, type, question, anon, multiple_answers, options)
    {
        const trigger = await this._addTrigger(
            chatId, action, factor, fullFactor, strictCase, autoDelete, "poll");

        const poll = await this.pool.query(`
                insert into poll_triggers (trigger_id, type, question, anon, multiple_answers)
                values ($1, $2, $3, $4, $5)
                returning id
            `, [
                trigger.id, type, question, anon, multiple_answers
            ]);

        for (let option of options) {
            await this.pool.query(`
                    insert into poll_options (poll_id, text)
                    values ($1, $2)
                `, [
                    poll.rows[0].id, option
                ]);
        }

        return trigger;
    }
}




module.exports = new DBHelper();
