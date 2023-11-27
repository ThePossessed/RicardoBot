const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('play-dl');
const fetch = require("node-fetch");
const isUrl = require("is-url");
require("dotenv").config();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause a song')
    ,
    async execute(interaction) {
        const { getVoiceConnection } = require('@discordjs/voice');

        const connection = getVoiceConnection(interaction.guild.id);


        if (connection == null) {
            let user = await client.users.fetch('345082365405560834');
            await interaction.reply(`Ricardo bot is not connected to any channel. ${user}, the god of water, please let me in!`);
        } else if (connection?.state.subscription?.player == null) {
            await interaction.reply("Not playing anything")
        } else {
            connection.state.subscription.player.pause();
            await interaction.reply("Paused")
        }

    },
};