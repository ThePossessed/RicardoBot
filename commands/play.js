const { Client, SlashCommandBuilder, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('play-dl');
const fetch = require("node-fetch");
const isUrl = require("is-url");
const { initiateConnection } = require("../utils/HelperFunction/initiateConnection")
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

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
    async execute(interaction, args, queue, client, mode) {
        // console.log("Channel: ", interaction["channelId"]);

        var url = args;
        var title;
        const songName = url; //interaction.options.getString('query');
        const validURL = isUrl(songName);
        const argument_list = url.split("&");
        console.log(url, songName);
        var is_playlist = false;
        var playlistID;
        var channelID = interaction.channelId;
        var isError = false;
        if (mode == "command") {
            await interaction.deferReply();
        }
        for (var i = 0; i < argument_list.length; i++) {
            try {
                const key_val = argument_list[i].split("=");
                if (key_val[0] === "list") {
                    playlistID = key_val[1];
                    is_playlist = true;
                    break;
                } else {
                    continue;
                }
            } catch (error) {
                continue;
            }
        }
        if (is_playlist) {
            // playlist request
            // https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistID}&key=${process.env.API_KEY}
            const ytUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistID}&key=${process.env.API_KEY}`
            await fetch(ytUrl)
                .then(response => response.json())
                .then(data => {
                    const songlist = data.items;
                    url = [];
                    for (var i = 0; i < songlist.length; i++) {
                        url.push([`https://www.youtube.com/watch?v=${songlist[i].snippet.resourceId.videoId}`, songlist[i].snippet.title])
                    }
                })
        }
        else if (validURL) {
            const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${songName}&key=${process.env.API_KEY}`;
            var videoID;
            await fetch(ytUrl)
                .then(response => response.json())
                .then(data => {
                    videoID = data.items[0].id.videoId;
                    title = data.items[0].snippet.title;
                }).then(() => {
                    url = [[`https://www.youtube.com/watch?v=${videoID}`, title]];
                }).catch((error) => {
                    isError = true
                    console.log(error);
                })
        } else if (!songName) {
            if (mode == "command") {
                interaction.editReply(`Why do you queue without song name? Onii-chan baka`);
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
                    url = [[`https://www.youtube.com/watch?v=${videoID}`, title]];
                }).catch((error) => {
                    isError = true
                    console.log(error);
                })
        }

        if (isError) {
            return queue;
        }

        for (var i = 0; i < url.length; i++) {
            queue.push(url[i]);
        }
        if (curState !== "I") {
            if (mode == "command") {
                if (is_playlist) {
                    interaction.editReply(`Queued playlist with ${url.length} songs!`);
                } else {
                    interaction.editReply(`Queued [${url[0][1]}](${url[0][0]})`);
                }
            }
        }
        else {
            curState = "B";
            url = queue.shift();
            if (client.isLoop) {
                queue.push(url);
            }
            client.currentSong = url;
            title = url[1];
            url = url[0];
            fetch(`https://noembed.com/embed?dataType=json&url=${url}`)
                .then(res => res.json())
                .then(async () => {
                    var player;
                    player = createAudioPlayer();

                    console.log(url);
                    const source = await ytdl.stream(url);
                    const resource = createAudioResource(source.stream, { inputType: source.type });

                    var connectionArg = initiateConnection(interaction.member.voice.channel.id, interaction.guild.id, interaction.guild.voiceAdapterCreator, client)
                    const connection = connectionArg.connection

                    if (typeof connection?.state.subscription?.player !== "undefined") {
                        connection.state.subscription.player.stop();
                    }

                    connection.subscribe(player);
                    player.play(resource);

                    // console.log('fetch', title);
                    if (mode == "command") {
                        interaction.editReply(`Playing [${title}](${url})`);
                    }
                    player.on("error", error => {
                        console.log(`Error: ${error.message} with resource ${error.resource.metadata.title}`)
                    });

                    connection.on(VoiceConnectionStatus.Destroyed, () => {
                        queue = [];
                        player.stop();
                        curState = "I";
                    })

                    player.on(AudioPlayerStatus.Idle, async () => {
                        console.log("Idle player: ", queue)
                        if (queue.length !== 0) {
                            const song = queue.shift();
                            if (client.isLoop) {
                                queue.push(song);
                            }
                            client.currentSong = song;
                            const source = await ytdl.stream(song[0]);
                            const resource = createAudioResource(source.stream, { inputType: source.type });
                            player.play(resource);
                            // const embedmsg = new EmbedBuilder()
                            //     .setTitle(song[1])
                            //     .setURL(song[0])

                            // // await interaction.reply({ content: `Your wish is my command. ${user} shall grant you his precious nude.`, embeds: [embedmsg] })
                            // client.channels.cache.get(channelID).send({ content: `Playing `, embeds: [embedmsg] });
                        } else {
                            player.stop(); //connection.state.subscription.player.stop();
                            curState = "I";
                        }
                    })

                    player.on('stateChange', async (oldState, newState) => {
                        console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
                        if (newState.status === 'idle' || newState.status === 'autopaused') {
                            curState = "I";
                        } else {
                            curState = "B";
                        }
                    })
                }).catch((error) => {
                    curState = "I";
                    console.log(error);
                })
        }
        return queue;
    },
};