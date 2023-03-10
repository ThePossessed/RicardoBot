# RicardoBot
Discord bot for Ricardo Discord Server

Run

```
npm install
```

Dependencies will be installed from the above command. I'd suggest using Docker to get all the necessary requirements. Make a .env file, add DISCORD_TOKEN= the token. This should be private and not public. I will send the developers the token privately.

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
[DiscordJs Documentation](https://discordjs.guide/#before-you-begin)
