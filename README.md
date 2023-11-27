# RicardoBot
Discord bot for Ricardo Discord Server

## Requirements
Run

```
npm install
```

Dependencies will be installed from the above command. I'd suggest using Docker to get all the necessary requirements. Make a .env file, add DISCORD_TOKEN= the token. This should be private and not public. Contact the developers to get the token privately.

Install ffmpeg on computer 

[ffmpeg source](https://ffmpeg.org/)

## Run to test running bot

```
npm start
```

## Run with Docker
I've just created a Dockerfile, which you can now build and run on Docker for better environment.

```
docker build -t ricardo-bot .
docker run --rm -it ricardo-bot
```

## Resources for Devs:
[DiscordJs Documentation](https://discordjs.guide/#before-you-begin)
