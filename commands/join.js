const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, EndBehaviorType } = require('@discordjs/voice');
const fs = require("fs")
const prism = require("prism-media")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('join channel'),
    async execute(interaction) {
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false
        });
        // connection.receiver.speaking.on('start', (userId) => {
        //     console.log(userId);
        //     const audio = connection.receiver.subscribe(userId, {
        //         end: {
        //             behavior: EndBehaviorType.AfterSilence,
        //             duration: 100
        //         }
        //     });
        //     const currentdate = new Date();
        //     const timestamp = "" + currentdate.getDate() + (currentdate.getMonth() + 1) + currentdate.getFullYear() + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds();
        //     const saveDir = `${__dirname}/../assets/${userId}`
        //     const fileName = `${userId}_${timestamp}.pcm`
        //     const writeStream = fs.createWriteStream(saveDir + "/" + fileName)
        //     if (!fs.existsSync(saveDir)) {
        //         fs.mkdirSync(saveDir);
        //     }

        //     const opusDecoder = new prism.opus.Decoder({
        //         frameSize: 960,
        //         channels: 2,
        //         rate: 48000,
        //     })

        //     audio.pipe(opusDecoder).pipe(writeStream)
        // })

        await interaction.reply("Joining voice channel");
    },
};