CREATE TYPE mess_type AS ENUM (
	'text',
	'animation',
	'audio',
	'dice',
	'document',
	'game',
	'invoice',
	'location',
	'photo',
	'poll',
	'quiz',
	'sticker',
	'video',
	'videonote',
	'voice'
);

CREATE TYPE poll_type AS ENUM (
	'regular',
	'quiz'
);

CREATE TYPE entity_type AS ENUM (
	'bold',
	'italic',
	'underline',
	'striketrough',
	'code',
	'spoiler',
	'pre',
	'mention',
	'url',
	'text_link'
);

CREATE TABLE IF NOT EXISTS public.users (
	id bigint NOT NULL PRIMARY KEY,
	username character varying(32) DEFAULT NULL::character varying,
	first_name character varying(256) NOT NULL,
	last_name character varying(256) DEFAULT NULL::character varying
);

CREATE TABLE IF NOT EXISTS public.chats (
	id bigint NOT NULL PRIMARY KEY,
	username character varying(32) DEFAULT NULL::character varying,
	title character varying(255) NOT NULL,
	last_trigger_index int DEFAULT 0 NOT NULL,
	lang character(3) DEFAULT 'eng' NOT NULL,
	only_admins boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS public.triggers (
	id bigserial NOT NULL PRIMARY KEY,
	chat_id bigint NOT NULL,
	creator_id bigint NOT NULL,
	index integer NOT NULL,
	type mess_type NOT NULL,
	action boolean DEFAULT false NOT NULL,
	factor character varying(255) NOT NULL,
	full_factor boolean NOT NULL,
	strict_case boolean NOT NULL,
	auto_delete int DEFAULT 0 NOT NULL,
	reply boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS public.entities (
	id bigserial NOT NULL PRIMARY KEY,
	trigger_id bigint NOT NULL,
	type entity_type NOT NULL,
	"offset" integer NOT NULL,
	length integer NOT NULL,
	url character varying(4096) DEFAULT NULL::character varying
);

CREATE TABLE IF NOT EXISTS public.text_triggers (
	id bigserial NOT NULL PRIMARY KEY,
	trigger_id bigint NOT NULL,
	text text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.dice_triggers (
	id bigserial NOT NULL PRIMARY KEY,
	trigger_id bigint NOT NULL,
	emoji character varying(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.location_triggers (
	id bigserial NOT NULL PRIMARY KEY,
	trigger_id bigint NOT NULL,
	coords point NOT NULL
);

CREATE TABLE IF NOT EXISTS public.file_triggers (
	id bigserial NOT NULL PRIMARY KEY,
	trigger_id bigint NOT NULL,
	fileid character varying(255) NOT NULL,
	caption text DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.game_triggers (
	id bigserial NOT NULL PRIMARY KEY,
	trigger_id bigint NOT NULL,
	name character varying(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.poll_triggers (
	id bigserial NOT NULL PRIMARY KEY,
	trigger_id bigint NOT NULL,
	type poll_type DEFAULT 'regular'::poll_type NOT NULL,
	question character varying(255) NOT NULL,
	anon boolean DEFAULT false NOT NULL,
	multiple_answers boolean DEFAULT false NOT NULL,
	correct_option_index int DEFAULT NULL,
	explanation character varying(255) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.poll_options (
	id bigserial NOT NULL PRIMARY KEY,
	poll_id bigint NOT NULL,
	text character varying(255)
);

CREATE INDEX IF NOT EXISTS users_first_name_index         ON public.users    USING btree (first_name);
CREATE INDEX IF NOT EXISTS users_last_name_index          ON public.users    USING btree (last_name);
CREATE INDEX IF NOT EXISTS users_username_index           ON public.users    USING btree (username);
CREATE INDEX IF NOT EXISTS chats_username_index           ON public.chats    USING btree (username);
CREATE INDEX IF NOT EXISTS chats_title_index              ON public.chats    USING btree (title);
CREATE INDEX IF NOT EXISTS chats_last_trigger_index_index ON public.chats    USING btree (last_trigger_index);
CREATE INDEX IF NOT EXISTS chats_lang_index               ON public.chats    USING btree (lang);
CREATE INDEX IF NOT EXISTS chats_only_admins_index        ON public.chats    USING btree (only_admins);
CREATE INDEX IF NOT EXISTS triggers_index_index           ON public.triggers USING btree (index);
CREATE INDEX IF NOT EXISTS triggers_type_index            ON public.triggers USING btree (type);
CREATE INDEX IF NOT EXISTS triggers_action_index          ON public.triggers USING btree (action);
CREATE INDEX IF NOT EXISTS triggers_factor_index          ON public.triggers USING btree (factor);
CREATE INDEX IF NOT EXISTS triggers_full_factor_index     ON public.triggers USING btree (full_factor);
CREATE INDEX IF NOT EXISTS triggers_strict_case_index     ON public.triggers USING btree (strict_case);
CREATE INDEX IF NOT EXISTS triggers_auto_delete_index     ON public.triggers USING btree (auto_delete);
CREATE INDEX IF NOT EXISTS triggers_reply_index           ON public.triggers USING btree (reply);
CREATE INDEX IF NOT EXISTS entities_type_index            ON public.entities USING btree (type);
CREATE INDEX IF NOT EXISTS entities_offset_index          ON public.entities USING btree ("offset");
CREATE INDEX IF NOT EXISTS entities_length_index          ON public.entities USING btree (length);
CREATE INDEX IF NOT EXISTS entities_url_index             ON public.entities USING btree (url);

ALTER TABLE public.triggers          ADD CONSTRAINT triggers_chat_id_fkey             FOREIGN KEY (chat_id)    REFERENCES public.chats(id)         ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.triggers          ADD CONSTRAINT triggers_creator_id_fkey          FOREIGN KEY (creator_id) REFERENCES public.users(id)         ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.entities          ADD CONSTRAINT entities_trigger_id_fkey          FOREIGN KEY (trigger_id) REFERENCES public.triggers(id)      ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.text_triggers     ADD CONSTRAINT text_triggers_trigger_id_fkey     FOREIGN KEY (trigger_id) REFERENCES public.triggers(id)      ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.dice_triggers     ADD CONSTRAINT dice_triggers_trigger_id_fkey     FOREIGN KEY (trigger_id) REFERENCES public.triggers(id)      ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.location_triggers ADD CONSTRAINT location_triggers_trigger_id_fkey FOREIGN KEY (trigger_id) REFERENCES public.triggers(id)      ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.file_triggers     ADD CONSTRAINT file_triggers_trigger_id_fkey     FOREIGN KEY (trigger_id) REFERENCES public.triggers(id)      ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.game_triggers     ADD CONSTRAINT game_triggers_trigger_id_fkey     FOREIGN KEY (trigger_id) REFERENCES public.triggers(id)      ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.poll_triggers     ADD CONSTRAINT poll_triggers_trigger_id_fkey     FOREIGN KEY (trigger_id) REFERENCES public.triggers(id)      ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.poll_options      ADD CONSTRAINT poll_options_poll_id_fkey         FOREIGN KEY (poll_id)    REFERENCES public.poll_triggers(id) ON UPDATE CASCADE ON DELETE CASCADE;
