const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, EndBehaviorType } = require('@discordjs/voice');
const fs = require("fs")
const prism = require("prism-media")
const { initiateConnection } = require("../utils/HelperFunction/initiateConnection")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('join channel'),
    async execute(interaction) {
        // const connection = initiateConnection(interaction.member.voice.channel.id, interaction.guild.id, interaction.guild.voiceAdapterCreator);

        var connection = getVoiceConnection(interaction.guild.id, interaction.member.voice.channel.id);
        if (connection == null) {
            connection = joinVoiceChannel({
                channelId: channelId,
                guildId: guildId,
                adapterCreator: adapterCreator,
                selfDeaf: false
            });
            await interaction.reply("Joining voice channel");
        }
        else {
            await interaction.reply("Already in a channel");
        }
    },
};