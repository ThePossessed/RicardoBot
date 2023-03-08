# RicardoBot
Discord bot for Ricardo Discord Server

Run

```
npm install dotenv
npm install discord.js
```

Technically, the node_modules are created from the npm install discord.js.

Make a .env file, add DISCORD_TOKEN= the token. This should be private and not public. I will send the developers the token privately.

Run to test running bot

```
node index.js
```

## Run with Docker
I've just created a Dockerfile, which you can now build and run on Docker for better environment.

```
docker build -t ricardo-bot .
docker run --rm -it ricardo-bot
```

## Resources for Devs:
![DiscordJs Documentation](https://discordjs.guide/#before-you-begin)
