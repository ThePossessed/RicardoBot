const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const axios = require("axios").default;
const fetch = require("node-fetch");
const { initiateConnection } = require("../utils/HelperFunction/initiateConnection")
require("dotenv").config();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('speak something')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to speak')
                .setRequired(false)
        ),
    async execute(interaction, args) {
        if (args.length == 0) {
            var base64data = "data:audio/mp3;base64," + process.env.TESTDATA;
            if (typeof connection?.state.subscription.player !== "undefined") {
                connection.state.subscription.player.stop();
            }
            const player = createAudioPlayer();

            // console.log(url);
            const resource = createAudioResource(base64data);

            var connection = initiateConnection(interaction.member.voice.channel.id, interaction.guild.id, interaction.guild.voiceAdapterCreator)
            // connection.state.subscription.player.stop();
            // connection.destroy();

            connection.subscribe(player);
            player.play(resource);

            await interaction.reply("Speaking");
        }
        else {
            const options = {
                method: "POST",
                url: "https://api.edenai.run/v2/translation/language_detection",
                headers: {
                    authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`
                },
                data: {
                    show_original_response: false,
                    fallback_providers: "",
                    providers: 'google',
                    text: args
                }
            }

            axios
                .request(options)
                .then((response) => {
                    console.log(response.data.google.items[0].language)
                    const options = {
                        method: "POST",
                        url: "https://api.edenai.run/v2/audio/text_to_speech",
                        headers: {
                            authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`,
                        },
                        data: {
                            show_original_response: false,
                            fallback_providers: "",
                            providers: "google",
                            language: response.data.google.items[0].language,
                            text: args,
                            option: "FEMALE",
                        },
                    };

                    axios
                        .request(options)
                        .then(async (response) => {
                            var base64data;
                            if (response.data.google.audio.length == 0) {
                                base64data = "data:audio/mp3;base64," + process.env.TESTDATA;
                            } else {
                                base64data = "data:audio/mp3;base64," + response.data.google.audio;
                            }
                            if (typeof connection?.state.subscription.player !== "undefined") {
                                connection.state.subscription.player.stop();
                            }
                            const player = createAudioPlayer();

                            // console.log(url);
                            const resource = createAudioResource(base64data);

                            var connection = initiateConnection(interaction.member.voice.channel.id, interaction.guild.id, interaction.guild.voiceAdapterCreator)
                            // connection.state.subscription.player.stop();
                            // connection.destroy();

                            connection.subscribe(player);
                            player.play(resource);

                            await interaction.reply("Speaking");
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    },
};