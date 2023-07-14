const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const fetch = require("node-fetch");
const isUrl = require("is-url");
require("dotenv").config();


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('play music')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('song URL or song name')
                .setRequired(false)
        ),
    async execute(interaction) {
        // console.log("Channel: ", interaction["channelId"]);

        var url = 'https://www.youtube.com/watch?v=BYnD5Bwm6Gk&ab_channel=PixelNeko';
        var title;
        const songName = interaction.options.getString('query');
        const validURL = isUrl(songName);
        if (validURL) {
            url = songName;
        } else {
            const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${songName}&key=${process.env.API_KEY}`;
            var videoID;
            await fetch(ytUrl)
                .then(response => response.json())
                .then(data => {
                    videoID = data.items[0].id.videoId;
                }).then(() => {
                    url = `http://www.youtube.com/watch?v=${videoID}`;
                }).catch((error) => {
                    console.log(error);
                })
        }
        fetch(`https://noembed.com/embed?dataType=json&url=${url}`)
            .then(res => res.json())
            .then((data) => {
                title = data.title;
            }).then(async () => {
                const player = createAudioPlayer();

                console.log(url);
                const source = ytdl(url, { filter: 'audioonly' });
                const resource = createAudioResource(source);

                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                connection.subscribe(player);
                player.play(resource);

                // console.log('fetch', title);
                interaction.reply(`Playing ${title}`);

            }).catch((error) => {
                console.log(error);
            })
    },
};