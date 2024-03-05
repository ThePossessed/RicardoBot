const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thirsty')
        .setDescription('Ask Hai Nam to give out some water'),
    async execute(interaction) {
        let user = await client.users.fetch('345082365405560834');
        await interaction.deferReply();
        if (user) {
            await interaction.editReply(`${interaction.user} is about to die due to lack of water. ${user} please share some`);
        } else {
            await interaction.editReply(`No water :(`)
        }
    },
};