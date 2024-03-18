const { Client, SlashCommandBuilder, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listsong')
        .setDescription('List all the current songs in the queue and status of the queue')
    ,
    async execute(interaction, queue, client) {
        // const exampleEmbed = new EmbedBuilder()

        try {
            if (connection.state.subscription.player.state.status === 'idle' && client.queue.length === 0) {
                await interaction.deferReply();
                await interaction.editReply(`The queue is empty... Baka...`);
            }
            else {
                await interaction.deferReply();

                var position = "";
                var song = ""

                for (var i = 0; i < queue.length; i++) {
                    // urlList.push(queue[i][0])
                    // songNameList.push(queue[i][1])
                    position += `${i + 1}\n`
                    song += `[${queue[i][1].slice(0, 30)}](${queue[i][0]})\n`
                }

                await interaction.editReply({
                    embeds: [{
                        color: 3447003,
                        // title: `Currently playing [${client.currentSong[1]}](${client.currentSong[0]})`,
                        fields: [
                            queue.length === 0 ? { name: '', value: `Currently playing [${client.currentSong[1]}](${client.currentSong[0]})`, inline: false } :
                                ({ name: '', value: `Currently playing [${client.currentSong[1]}](${client.currentSong[0]})`, inline: false },
                                    { name: "Position", value: position, inline: true },
                                    { name: "Song", value: song, inline: true })
                        ]
                    }]
                });
            }
        }
        catch (e) {
            console.log(e);
        }
        return queue;
    },
};
