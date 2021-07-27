const pg = require("pg");

const config = require("./config");




class DBHelper
{
    async _addTrigger(chatId, action, factor, fullFactor, type)
    {
        const index = await this.pool.query(`
                update chats set last_trigger_index = last_trigger_index + 1
                where id = $1
                returning last_trigger_index
            `, [
                chatId
            ]);

        const trigger = await this.pool.query(`
                insert into triggers (chat_id, index, type, action, factor, full_factor)
                values ($1, $2, $3, $4, $5, $6)
                returning id, index, type, action, factor, full_factor
            `, [
                chatId, index.rows[0].last_trigger_index, type, action, factor, fullFactor
            ]);

        return trigger.rows[0];
    }

    constructor()
    {
        this.pool = null;
    }

    async start()
    {
        this.pool = new pg.Pool({
            host:     config.db.host,
            user:     config.db.user,
            password: config.db.password,
            database: config.db.database,
            port:     config.db.port,
            max:      1
        });

        this.pool.on("error", async (err, client) => {
            console.error("PostgreSQL pool is down!", err);
            await this.pool.end();
            process.exit(-1);
        });

        await this.pool.query(`
            create table if not exists users (
                id bigint not null primary key,
                username varchar(32) default null,
                first_name varchar(256) not null,
                last_name varchar(256) default null
            )`);

        await this.pool.query(`
            create table if not exists chats (
                id bigint not null primary key,
                username varchar(32) default null,
                title varchar(255) not null,
                last_trigger_index int not null default 0
            )`);

        try {
            await this.pool.query(`
                create type mess_type as enum (
                    'text', 'animation', 'audio', 'dice', 'document', 'game', 'invoice', 'location', 'photo', 'poll', 'quiz', 'sticker', 'video', 'videonote', 'voice'
                )`);
        }
        catch (err) {}

        await this.pool.query(`
            create table if not exists triggers (
                id bigserial not null primary key,
                chat_id bigint not null
                    references chats (id)
                    on delete cascade on update cascade,
                index int not null,
                type mess_type not null,
                action boolean not null default false,
                factor varchar(255) not null,
                full_factor boolean not null
            )`);

        await this.pool.query(`
            create table if not exists text_triggers (
                id bigserial not null primary key,
                trigger_id bigint not null
                    references triggers (id)
                    on delete cascade on update cascade,
                text text not null
            )`);

        await this.pool.query(`
            create table if not exists dice_triggers (
                id bigserial not null primary key,
                trigger_id bigint not null
                    references triggers (id)
                    on delete cascade on update cascade,
                emoji varchar(32) not null
            )`);

        await this.pool.query(`
            create table if not exists location_triggers (
                id bigserial not null primary key,
                trigger_id bigint not null
                    references triggers (id)
                    on delete cascade on update cascade,
                coords point not null
            )`);

        await this.pool.query(`
            create table if not exists file_triggers (
                id bigserial not null primary key,
                trigger_id bigint not null
                    references triggers (id)
                    on delete cascade on update cascade,
                fileid varchar(255) not null,
                caption text default null
            )`);

        await this.pool.query(`
            create table if not exists game_triggers (
                id bigserial not null primary key,
                trigger_id bigint not null
                    references triggers (id)
                    on delete cascade on update cascade,
                name varchar(255) not null
            )`);

        try {
            await this.pool.query(`
                create type poll_type as enum (
                    'regular', 'quiz'
                )`);
        }
        catch (err) {}

        await this.pool.query(`
            create table if not exists poll_triggers (
                id bigserial not null primary key,
                trigger_id bigint not null
                    references triggers (id)
                    on delete cascade on update cascade,
                type poll_type not null default 'regular',
                question varchar(255) not null,
                anon boolean not null default false,
                multiple_answers boolean not null default false,
                correct_option_index int default null,
                explanation varchar(255) default null
            )`);

        await this.pool.query(`
            create table if not exists poll_options (
                id bigserial not null primary key,
                poll_id bigint not null
                    references poll_triggers (id)
                    on delete cascade on update cascade,
                text varchar(255)
            )`);
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
                on conflict (id) do update set
                username = $2, first_name = $3, last_name = $4
            `, [
                id, username, firstName, lastName
            ]);
    }

    async updateChat(id, username, title)
    {
        await this.pool.query(`
                insert into chats (id, username, title)
                values ($1, $2, $3)
                on conflict (id) do update set
                username = $2, title = $3
            `, [
                id, username, title
            ]);
    }

    async getTrigger(chatId, index)
    {
        let trigger = await this.pool.query(`
                select id, index, type, action, factor, full_factor
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
                `, [
                    trigger.id
                ]);

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
                `, [
                    trigger.id
                ]);

            file = file.rows[0];
            trigger.fileid  = file.fileid;
            trigger.caption = file.caption;
        break;
        case "dice":
            let dice = await this.pool.query(`
                    select emoji
                    from dice_triggers
                    where trigger_id = $1
                `, [
                    trigger.id
                ]);

            trigger.emoji = dice.rows[0].emoji;
        break;
        case "location":
            let coords = await this.pool.query(`
                    select coords
                    from location_triggers
                    where trigger_id = $1
                `, [
                    trigger.id
                ]);

            coords = coords.rows[0].coords;
            trigger.latitude  = coords.x;
            trigger.longitude = coords.y;
        break;
        case "poll":
            let poll = await this.pool.query(`
                    select id, question, anon, multiple_answers
                    from poll_triggers
                    where trigger_id = $1
                `, [
                    trigger.id
                ]);

            poll = poll.rows[0];
            trigger.question        = poll.question;
            trigger.anon            = poll.anon;
            trigger.multipleAnswers = poll.multiple_answers;

            let options = await this.pool.query(`
                    select text
                    from poll_options
                    where poll_id = $1
                `, [
                    poll.id
                ]);

            trigger.options = options.rows.map(o => o.text);
        break;
        }

        trigger.id = undefined;

        return trigger;
    }

    async getChatTriggers(chatId)
    {
        const triggers = await this.pool.query(`
                select index, type, action, factor, full_factor
                from triggers
                where chat_id = $1
            `, [
                chatId
            ]);

        return triggers.rows;
    }

    async findTriggers(chatId, text)
    {
        const triggers = await this.pool.query(`
                select index
                from triggers
                where chat_id = $1
                and action = false
                and $2 like '%' || factor || '%'
                and full_factor = false
            `, [
                chatId, text
            ]);

        const fullTriggers = await this.pool.query(`
                select index
                from triggers
                where chat_id = $1
                and action = false
                and factor = $2
                and full_factor = true
            `, [
                chatId, text
            ]);

        return triggers.rows.map(t => t.index)
            .concat(fullTriggers.rows.map(t => t.index));
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

    async addTextTrigger(chatId, action, factor, fullFactor, text)
    {
        const trigger = await this._addTrigger(chatId, action, factor, fullFactor, "text");

        await this.pool.query(`
                insert into text_triggers (trigger_id, text)
                values ($1, $2)
            `, [
                trigger.id, text
            ]);

        return trigger;
    }

    async addFileTrigger(chatId, action, factor, fullFactor, type, fileid, caption)
    {
        const trigger = await this._addTrigger(chatId, action, factor, fullFactor, type);

        await this.pool.query(`
                insert into file_triggers (trigger_id, fileid, caption)
                values ($1, $2, $3)
            `, [
                trigger.id, fileid, caption
            ]);

        return trigger;
    }

    async addDiceTrigger(chatId, action, factor, fullFactor, emoji)
    {
        const trigger = await this._addTrigger(chatId, action, factor, fullFactor, "dice");

        await this.pool.query(`
                insert into dice_triggers (trigger_id, emoji)
                values ($1, $2)
            `, [
                trigger.id, emoji
            ]);

        return trigger;
    }

    async addLocationTrigger(chatId, action, factor, fullFactor, latitude, longitude)
    {
        const trigger = await this._addTrigger(chatId, action, factor, fullFactor, "location");

        await this.pool.query(`
                insert into location_triggers (trigger_id, coords)
                values ($1, point ($2, $3))
            `, [
                trigger.id, latitude, longitude
            ]);

        return trigger;
    }

    async addPollTrigger(chatId, action, factor, fullFactor, type, question, anon, multiple_answers, options)
    {
        const trigger = await this._addTrigger(chatId, action, factor, fullFactor, "poll");

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
