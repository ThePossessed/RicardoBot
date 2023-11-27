const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const fetch = require("node-fetch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('force leave voice'),
    async execute(interaction) {
        const { getVoiceConnection } = require('@discordjs/voice');

        const connection = getVoiceConnection(interaction.guild.id);

        if (connection == null) {
            await interaction.reply("Not in voice channel");
        }
        else {
            try {
                if (typeof connection?.state.subscription?.player !== "undefined") {
                    connection.state.subscription?.player.stop();
                }
                connection.destroy();
                await interaction.reply("Leaving voice channel");
            } catch (error) {
                console.log(error);
            }
        }
    },
};