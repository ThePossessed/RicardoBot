const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, EndBehaviorType, getVoiceConnection } = require('@discordjs/voice');
const fs = require("fs")
const prism = require("prism-media")
const ffmpeg = require("fluent-ffmpeg")

function saveAsMP3(input, output, callback) {
    ffmpeg(input)
        .output(output)
        .on('end', function () {
            console.log('conversion ended');
            callback(null);
        }).on('error', function (err) {
            console.log('error: ', e.code, e.msg);
            callback(err);
        }).run();
}
function initiateConnection(channelId, guildId, adapterCreator) {
    const recording = false;
    var connection = getVoiceConnection(guildId, channelId);
    if (connection == null) {
        connection = joinVoiceChannel({
            channelId: channelId,
            guildId: guildId,
            adapterCreator: adapterCreator,
            selfDeaf: false
        });
        if (recording) {
            const buffer = [];
            const opusDecoder = new prism.opus.Decoder({
                frameSize: 960,
                channels: 2,
                rate: 48000,
            })
            const opusEncoder = new prism.opus.Encoder(
                48000, 2
            )

            connection.receiver.speaking.on('start', (userId) => {
                if (connection.receiver.subscriptions.get(userId) == null) {
                    const currentdate = new Date();
                    const timestamp = "" + currentdate.getDate() + (currentdate.getMonth() + 1) + currentdate.getFullYear() + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds();
                    const saveDir = `${__dirname}/../../voiceData/${userId}`
                    const fileName = `${userId}_${timestamp}.pcm`
                    const writeStream = fs.createWriteStream(saveDir + "/" + fileName)
                    const audio = connection.receiver.subscribe(userId, {
                        end: {
                            behavior: EndBehaviorType.AfterSilence,
                            duration: 1000
                        }
                    });
                    console.log(`${userId} Speaking at ${currentdate}`)
                    if (!fs.existsSync(saveDir)) {
                        fs.mkdirSync(saveDir);
                    }

                    audio.pipe(opusDecoder).pipe(writeStream)
                    // TODO: only take large files
                    // writeStream.on("close", () => {
                    //     const fileStats = fs.statSync(saveDir + "/" + fileName)
                    //     console.log(`file ${saveDir + "/" + fileName} size: ${fileStats.size}`)
                    // })
                }
                else {
                    return
                }
            }
            )

            // connection.receiver.speaking.on("data", (chunk) => {
            //     buffer.push(opusEncoder.decode(chunk))
            // })

            // connection.receiver.speaking.on("end", (userId) => {
            //     console.log(`${buffer}`)
            //     console.log(`${userId} Data size ${buffer.length}`)
            // })
        }
    }
    return connection
}

module.exports = { initiateConnection }