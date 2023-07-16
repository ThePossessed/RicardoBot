const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('play-dl');
const fetch = require("node-fetch");
const isUrl = require("is-url");
require("dotenv").config();

var curState = "I";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play music')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('song URL or song name')
                .setRequired(false)
        ),
    async execute(interaction, args, queue) {
        // console.log("Channel: ", interaction["channelId"]);

        var url = args;
        var title;
        const songName = interaction.options.getString('query');
        const validURL = isUrl(songName);
        if (validURL) {
            url = songName;
        } else if (!songName) {
            queue.shift();
            if (!queue) {
                curState = "I";
            }
            return queue;
        } else {
            const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${songName}&key=${process.env.API_KEY}`;
            var videoID;
            await fetch(ytUrl)
                .then(response => response.json())
                .then(data => {
                    videoID = data.items[0].id.videoId;
                    title = data.items[0].snippet.title;
                }).then(() => {
                    url = `https://www.youtube.com/watch?v=${videoID}`;
                }).catch((error) => {
                    console.log(error);
                })
        }
        queue.push(url);
        if (curState !== "I") {
            interaction.reply(`Queued ${title}`);
        }
        else {
            curState = "B";
            url = queue.shift();
            fetch(`https://noembed.com/embed?dataType=json&url=${url}`)
                .then(res => res.json())
                .then(async () => {
                    const player = createAudioPlayer();

                    console.log(url);
                    const source = await ytdl.stream(url);
                    const resource = createAudioResource(source.stream, { inputType: source.type });

                    const connection = joinVoiceChannel({
                        channelId: interaction.member.voice.channel.id,
                        guildId: interaction.guild.id,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                    });

                    connection.subscribe(player);
                    player.play(resource);

                    // console.log('fetch', title);
                    interaction.reply(`Playing ${title}`);

                    player.on("error", error => {
                        console.log(`Error: ${error.message} with resource ${error.resource.metadata.title}`)
                    });

                    connection.on(VoiceConnectionStatus.Destroyed, () => {
                        queue = [];
                        player.stop();
                        curState = "I";
                    })

                    player.on(AudioPlayerStatus.Idle, async () => {
                        if (queue) {
                            const source = await ytdl.stream(queue.shift());
                            const resource = createAudioResource(source.stream, { inputType: source.type });
                            player.play(resource);
                        } else {
                            player.stop();
                            curState = "I";
                        }
                    })
                }).catch((error) => {
                    console.log(error);
                })
        }
        return queue;
    },
};