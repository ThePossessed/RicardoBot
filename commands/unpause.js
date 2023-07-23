const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('play-dl');
const fetch = require("node-fetch");
const isUrl = require("is-url");
require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unpause')
        .setDescription('unpause a song')
    ,
    async execute(interaction) {
        const { getVoiceConnection } = require('@discordjs/voice');

        const connection = getVoiceConnection(interaction.guild.id);

        connection.state.subscription.player.unpause();

        await interaction.reply("Unpaused");
    },
};