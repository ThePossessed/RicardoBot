const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const fetch = require("node-fetch");
const { destroyConnection } = require('../utils/HelperFunction/destroyConnection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Allow playing music in loop'),
    async execute(interaction, client) {
        client.isLoop = !client.isLoop;
        await interaction.deferReply();

        interaction.editReply(`Songs now ${client.isLoop ? 'are now' : 'are now not'} played in loop`);
    },
};