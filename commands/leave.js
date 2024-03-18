const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const fetch = require("node-fetch");
const { destroyConnection } = require('../utils/HelperFunction/destroyConnection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('force leave voice'),
    async execute(interaction, client) {
        const { getVoiceConnection } = require('@discordjs/voice');

        const connection = getVoiceConnection(interaction.guild.id);
        await interaction.deferReply();

        if (connection == null) {
            await interaction.editReply("Not in voice channel");
        }
        else {
            try {
                if (typeof connection?.state.subscription?.player !== "undefined") {
                    connection.state.subscription?.player.stop();
                }
                destroyConnection(connection, client);
                client.queue = [];
                client.currentChannelID = '';
                client.currentGuildID = '';
                client.adapterCreator = '';
                client.currentSong = [];
                await interaction.editReply("Leaving voice channel");
            } catch (error) {
                console.log(error);
            }
        }
    },
};