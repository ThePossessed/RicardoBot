const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('play-dl');
const fetch = require("node-fetch");
const isUrl = require("is-url");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip a song')
    ,
    async execute(interaction, queue) {
        const { getVoiceConnection } = require('@discordjs/voice');

        const connection = getVoiceConnection(interaction.guild.id);
        if (connection == null) {
            connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: false
            });
        }

        if (queue.length === 0) {
            try {
                connection.state.subscription.player.stop();

                let user = await client.users.fetch('345082365405560834');
                await interaction.reply(`Ricardo bot out of water. ${user} gives me more onegai.`);

                return queue;
            } catch (error) {
                console.log(error);

                let user = await client.users.fetch('345082365405560834');
                await interaction.reply(`Ricardo bot is not connected to any channel. ${user}, the god of water, please let me in!`);

                return queue;
            }
        } else {
            const song = queue.shift();
            const source = await ytdl.stream(song[0]);
            const resource = createAudioResource(source.stream, { inputType: source.type });
            connection.state.subscription.player.play(resource);

            await interaction.reply(`Skip!! Now playing [${song[1]}](${song[0]})`);
            return queue;
        }
    },
};
