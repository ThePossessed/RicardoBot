const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('thirsty')
		.setDescription('Ask Hai Nam to give out some water'),
	async execute(interaction) {
        const client = new Client({ intents: [GatewayIntentBits.Guilds] });
        let user = client.users.fetch('345082365405560834');
        if (user){
            await interaction.reply(`${interaction.user.username} is about to die due to lack of water. ${user} please share some`);
        } else {
            await interaction.reply(`No water :(`)
        }
	},
};