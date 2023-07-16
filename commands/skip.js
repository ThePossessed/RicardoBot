const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('play-dl');
const fetch = require("node-fetch");
const isUrl = require("is-url");
require("dotenv").config();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip a song')
    ,
    async execute(interaction, queue) {
        const { getVoiceConnection } = require('@discordjs/voice');

        const connection = getVoiceConnection(interaction.guild.id);

        const player = createAudioPlayer();

        if (queue.length === 0) {
            connection.destroy();

            await interaction.reply("Leaving voice channel");
            return queue;
        } else {
            const source = await ytdl.stream(queue.shift());
            const resource = createAudioResource(source.stream, { inputType: source.type });
            connection.subscribe(player);
            player.play(resource);
            await interaction.reply("Skip!!");
            return queue;
        }
    },
};