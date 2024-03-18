const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, EndBehaviorType, getVoiceConnection } = require('@discordjs/voice');
const fs = require("fs")
const prism = require("prism-media")
const ffmpeg = require("fluent-ffmpeg")
const util = require("util")
const { exec, spawn } = require("child_process")

function saveAsMP3(input, output, callback) {
    ffmpeg(input)
        .output(output)
        .on('end', function () {
            console.log('conversion ended');
            callback(null);
        }).on('error', function (err) {
            console.log('error: ', err.code, err.msg);
            callback(err);
        }).run();
}

function initiateConnection(channelId, guildId, adapterCreator, client) {
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
            const opusEncoder = new prism.opus.Encoder(
                48000, 2
            )

            const receiver = connection.receiver

            receiver.speaking.on('start', async (userId) => {
                var audio;
                if (receiver.subscriptions.get(userId) == null) {
                    audio = receiver.subscribe(userId, {
                        end: {
                            behavior: EndBehaviorType.AfterSilence,
                            duration: 100
                        },
                    });
                    // TODO: only take large files
                    // writeStream.on("finish", () => {
                    //     const fileStats = fs.statSync(saveDir + "/" + fileName)
                    //     console.log(`file ${saveDir + "/" + fileName} size: ${fileStats.size}`)
                    // })
                    const currentdate = new Date();
                    const timestamp = "" + currentdate.getDate() + (currentdate.getMonth() + 1) + currentdate.getFullYear() + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds();
                    const saveDir = `${__dirname}/../../voiceData/${userId}`
                    if (!fs.existsSync(saveDir)) {
                        fs.mkdirSync(saveDir);
                    }
                    const fileName = `${userId}_${timestamp}.pcm`
                    const mp3Name = `${userId}_${timestamp}.mp3`
                    const writeStream = fs.createWriteStream(saveDir + "/" + fileName)
                    const opusDecoder = new prism.opus.Decoder({
                        frameSize: 960,
                        channels: 2,
                        rate: 48000,
                    })
                    console.log(`${userId} Speaking at ${currentdate}`) // ${util.inspect(writeStream, { depth: null })}
                    audio.pipe(opusDecoder).pipe(writeStream)
                    writeStream.on("finish", () => {
                        const fileStats = fs.statSync(saveDir + "/" + fileName)
                        console.log(`file ${saveDir + "/" + fileName} size: ${fileStats.size}`)
                        if (fileStats.size < 256000) {
                            fs.unlink(saveDir + "/" + fileName, (err) => {
                                if (err) {
                                    throw err;
                                }
                                console.log("File deleted due to small size")
                            })
                        }
                        else {
                            // saveAsMP3(saveDir + "/" + fileName, saveDir + "/" + mp3Name, (arg) => { console.log(arg) })
                            // exec(`ffmpeg -y -f s16le -ar 48k -ac 2 -i ${saveDir + " /" + fileName} ${saveDir + "/" + mp3Name}`)
                            const cmd = "ffmpeg"
                            const args = [
                                '-y',
                                '-f', 's16le',
                                '-ar', '48k',
                                '-ac', '2',
                                '-i', `${saveDir + "/" + fileName}`,
                                `${saveDir + "/" + mp3Name}`
                            ]
                            var proc = spawn(cmd, args)
                            proc.on('close', function () {
                                console.log('Successfully converted to MP3');
                            });
                        }
                    })
                }
            }
            )
        }
        client.currentChannelID = channelId
        client.currentGuildID = guildId
        client.adapterCreator = adapterCreator
        return {
            connection: connection,
            mode: "New"
        }
    }
    else {
        client.currentChannelID = channelId
        client.currentGuildID = guildId
        client.adapterCreator = adapterCreator
        return {
            connection: connection,
            mode: "Exist"
        }
    }
}

module.exports = { initiateConnection }