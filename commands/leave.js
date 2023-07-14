const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const fetch = require("node-fetch");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('force leave voice'),
    async execute(interaction) {
        const { getVoiceConnection } = require('@discordjs/voice');

        const connection = getVoiceConnection(interaction.guild.id);

        connection.destroy();

        await interaction.reply("Leaving voice channel");
    },
};