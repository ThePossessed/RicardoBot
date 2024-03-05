const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, EndBehaviorType, getVoiceConnection } = require('@discordjs/voice');
const fs = require("fs")
const prism = require("prism-media")
const { initiateConnection } = require("../utils/HelperFunction/initiateConnection")
const util = require("util")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('join channel'),
    async execute(interaction) {
        const connection = initiateConnection(interaction.member.voice.channel.id, interaction.guild.id, interaction.guild.voiceAdapterCreator);
        await interaction.deferReply();
        interaction.member.voice.channel.members.each(member => {
            console.log(member.user.id)
        })
        if (connection.mode == "New") {
            await interaction.editReply("Joining voice channel");
        }
        else {
            await interaction.editReply("Already in the channel");
        }
    },
};