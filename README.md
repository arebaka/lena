# LenaBot
*Тебе надо дорожить тем, что имеешь, пусть это и достается без особого труда.*

> A [Telegram](//telegram.org) bot who saves messages from group chats and sends them binding to triggers set by administrators.

## Commands
`/on <text>` – create a trigger for text  
`/on <"text">` – create a trigger for full message text  
`/off <number>` – delete the trigger by number  
`/onjoin` – create a trigger for someone joins the chat  
`/onleft` – create a trigger for someone lefts the chat  
`/list` – get all active triggers  
`/trigger <number>` – invoke active trigger by number forcibly

## Supported message types
+ 📃 text
+ 📹 animation
+ 🎧 audio
+ 🎲 dice
+ 🏷️ document
+ 🌐 location
+ 🖼️ photo
+ 📊 poll (not quiz)
+ 😽 sticker
+ 🎬 video
+ 🎥 videonote
+ 🎤 voice

## TLDR
1. Create and setup a bot via [@BotFather](//t.me/BotFather)
2. Install [PostgreSQL](//www.postgresql.org/download/) if you didnt
3. Create an empty database 'lena' in PSQL 'stalkee' owned to your user
4. Install [npm](//www.npmjs.com) & [node.js](//npmjs.com/package/node)
5. `npm i lenabot`
6. `export TOKEN=<TOKEN_FROM_BOTFATHER>`
7. `export DBPASSWORD=<YOUR_PSQL_PASSWORD>`
8. `export DBDATABASE=lena`
9. `npx lenabot`
10. Add your bot to a group chat and add triggers with commands above replying the messages to be resend
11. To stop the bot type to console with it `stop` and press enter

## Preparing
1. Create your bot via [@BotFather](//t.me/BotFather), it will guide you on that
2. The bot uses DBMS PostgreSQL. [Install](//www.postgresql.org/download/) if you dont have it
3. Create a database in PSQL for you bot
4. The bot works using [node.js](//npmjs.com/package/node). Install it
5. Get your Telegram ID using any special bot, e.g. [that](//t.me/myidbot)

## Installation
```bash
npm i lenabot
```

## Launch
The bot requires some environment variables. Here is a list of them:  
`TOKEN` – bot token from @BotFather  
`DBHOST` – host of PSQL, default `localhost`  
`DBUSER` – user of PSQL, default your current login  
`DBPASSWORD` – password of the PSQL user, default undefined  
`DBDATABASE` – name of the database for the bot in PSQL  
`DBPORT` – port for connecting to PSQL, default `5432` (standart)

After setup the environment run
```bash
npx lenabot
```

If everything went well, you will see something like this in the console:
```
> lenabot@1.0.0 start
> node index.js

Bot @eslenabot started.
> _
```

## Control
After the launch, there are available commands `stop` & `reload` for safe stop and restart respectively.

## Support
If something doesnt work, or you just want to talk to the bot creator or his mom, write [@arelive](//t.me/arelive). There also accepted kicks from volunteer project managers.
