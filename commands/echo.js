const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Echo something to the screen'),
	async execute(interaction) {
		await interaction.reply(`Hello ${interaction.user.username}`);
	},
};