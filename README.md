# LenaBot
*Всегда ненавидела эту суку!*

> A [Telegram](https://telegram.org) bot who saves messages from group chats and sends them binding to triggers.

![](https://img.shields.io/tokei/lines/github/arebaka/lena)
![](https://img.shields.io/github/repo-size/arebaka/lena)
![](https://img.shields.io/npm/v/lenabot)
![](https://img.shields.io/codefactor/grade/github/arebaka/lena)

![](https://img.shields.io/badge/English-100%25-brightgreen)
![](https://img.shields.io/badge/Russian-100%25-brightgreen)

## Commands
`/on <text>` – create a trigger on text  
`/off <number>` – delete the trigger by number  
`/onjoin` – create a trigger on someone joins the chat  
`/onleft` – create a trigger on someone lefts the chat  
`/list` – get all active triggers  
`/trigger <number>` – invoke active trigger by number forcibly  
`/settings` – configure the chat  
`/edit <number>` – configure the trigger by number

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
1. Create and setup a bot via [@BotFather](https://t.me/BotFather)
2. Install [PostgreSQL](https://www.postgresql.org/download/) if you didnt
3. Create an empty database 'lena' in PSQL owned to your user
4. Install [npm](https://www.npmjs.com) & [node.js](https://npmjs.com/package/node)
5. `npm i lenabot`
6. `export TOKEN=<TOKEN_FROM_BOTFATHER>`
7. `npx lenabot`
8. Add your bot to a group chat and add triggers with commands above replying the messages to be resend
9. To stop the bot type to console with it `stop` and press enter

## Preparing
1. Create your bot via [@BotFather](https://t.me/BotFather), it will guide you on that
2. The bot uses DBMS PostgreSQL. [Install](https://www.postgresql.org/download/) if you dont have it
3. Create a database in PSQL for you bot
4. The bot works using [node.js](https://npmjs.com/package/node). Install it

## Installation
```bash
npm i lenabot
```

## Launch
The bot requires some environment variables. Here is a list of them:  
`TOKEN` – bot token from @BotFather  
`DBURI` – URI-string for connection to PSQL in format `postgres://<USER>:<PASSWORD>@<HOST>/<DATABASE>:<PORT>`

Instead of the environment you can set launch parameters in a file `config.toml`.

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

## Usage
1. Send the message with one of the supported type
2. Reply to it with a command `/on` + the string on which you wanted to set the trigger (e.g. `/on !rules`)
3. If success, bot will answer that the trigger has been added, as well as offer to edit it by an inline button
4. Now, when a new message containing that string, bot will send a message that duplicates the one you replied to with the `/on` command
5. To trigger when someone enters/leaves the chat, send a command `/onjoin` / `/onleft` without parameters replying to the message
6. If the message is text or includes caption, it can contain some patterns that replaced with the corresponding values:
    - `{chat}` – title of the chat
    - `{chatid}` – Telegram ID of the chat
    - `{chatname}` – username of the chat, if there is
    - `{name}` – first name of the triggering message sender
    - `{fullname}` – first name and last name of the sender
    - `{mention}` – first name of the sender linked to them
    - `{username}` – username of the sender if there is (without @)
    - `{user}` – username with @ or linked first name to the sender
    - `{userid}` – Telegram ID of the sender
    - `{date}` – localized current date without time
    - `{time}` – localized current time
    - `{datetime}` – localized current date with time
    - `{message}` – text of the triggering message
    - `{messid}` – ID of the triggering message

![screenshot of usage](https://user-images.githubusercontent.com/36796676/141665612-2ec1fd5c-ccab-4b20-897b-13ee461c5753.png)

## Support
If something doesnt work, or you just wanna talk to the bot creator or his mom, write [@arelive](https://t.me/arelive). There also accepted kicks from volunteer project managers.
