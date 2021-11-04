# LenaBot
*Всегда ненавидела эту суку!*

> A [Telegram](//telegram.org) bot who saves messages from group chats and sends them binding to triggers set by administrators.

## Commands
`/on <text>` – create a trigger on text  
`/on <"text">` – create a trigger on full message text  
`/off <number>` – delete the trigger by number  
`/onjoin` – create a trigger on someone joins the chat  
`/onleft` – create a trigger on someone lefts the chat  
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
3. Create an empty database 'lena' in PSQL owned to your user
4. Install [npm](//www.npmjs.com) & [node.js](//npmjs.com/package/node)
5. `npm i lenabot`
6. `export TOKEN=<TOKEN_FROM_BOTFATHER>`
7. `npx lenabot`
8. Add your bot to a group chat and add triggers with commands above replying the messages to be resend
9. To stop the bot type to console with it `stop` and press enter

## Preparing
1. Create your bot via [@BotFather](//t.me/BotFather), it will guide you on that
2. The bot uses DBMS PostgreSQL. [Install](//www.postgresql.org/download/) if you dont have it
3. Create a database in PSQL for you bot
4. The bot works using [node.js](//npmjs.com/package/node). Install it

## Installation
```bash
npm i lenabot
```

## Launch
The bot requires some environment variables. Here is a list of them:  
`TOKEN` – bot token from @BotFather  
`DBURI` – URI-string for connection to PSQL in format `postgres://<USER>:<PASSWORD>@<HOST>/<DATABASE>:<PORT>`

Instead of the environment you can set launch parameters in a file config.toml.

After setup the environment run
```bash
npx lenabot
```

If everything went well, you will see something like this in the console:
```
> lenabot@1.2.0 start
> node index.js

Bot @eslenabot started.
> _
```

## Control
After the launch, there are available commands `stop` & `reload` for safe stop and restart respectively.

## Support
If something doesnt work, or you just wanna talk to the bot creator or his mom, write [@arelive](//t.me/arelive). There also accepted kicks from volunteer project managers.
