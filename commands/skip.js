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
    async execute(interaction, queue, client) {
        const { getVoiceConnection } = require('@discordjs/voice');

        const connection = getVoiceConnection(interaction.guild.id);

        await interaction.deferReply();

        if (connection == null) {
            let user = await client.users.fetch('345082365405560834');
            await interaction.editReply(`Ricardo bot is not connected to any channel. ${user}, the god of water, please let me in!`);
        }
        else if (queue.length === 0) {
            if (connection?.state.subscription?.player == null) {
                let user = await client.users.fetch('345082365405560834');
                await interaction.editReply(`Ricardo bot doesn't play anything. ${user} please play me.`);
            }
            else {
                try {
                    connection.state.subscription.player.stop();

                    let user = await client.users.fetch('345082365405560834');
                    await interaction.editReply(`Ricardo bot out of water. ${user} gives me more onegai.`);
                } catch (error) {
                    console.log(error);

                    let user = await client.users.fetch('345082365405560834');
                    await interaction.editReply(`Ricardo bot is not connected to any channel. ${user}, the god of water, please let me in!`);
                }
            }
        }
        else {
            const song = queue.shift();
            if (client.isLoop) {
                queue.push(song);
            }
            const source = await ytdl.stream(song[0]);
            const resource = createAudioResource(source.stream, { inputType: source.type });
            connection.state.subscription.player.play(resource);

            await interaction.editReply(`Skip!! Now playing [${song[1]}](${song[0]})`);
        }
        return queue
    },
};
