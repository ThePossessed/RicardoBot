console.log('Hello Ricardo!');

require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, IntentsBitField, ClientPresence, Presence } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');


const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, myIntents] });

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.queue = [];
client.player = createAudioPlayer();
client.connection = null;

client.on(Events.VoiceStateUpdate, async interaction => {
	const guildId = interaction.guild.id;
	const voiceId = interaction.channelId;
	let size;


	try {
		let guild = client.guilds.cache.get(guildId);
		let voiceChannel = await guild.channels.fetch(voiceId, { force: true })
		size = voiceChannel.members?.size;
	} catch (error) {
		console.log(error)
	}

	console.log("member in voice", size)

	if (size === 1) {
		try {
			const { getVoiceConnection } = require('@discordjs/voice');

			const connection = getVoiceConnection(interaction.guild.id);

			connection.destroy();
		} catch (error) {
			console.log(error)
		}
	} else {

	}
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (!interaction.member.voice.channel) {
		let user = await client.users.fetch('345082365405560834');
		await interaction.reply(`Thou must be in a voice channel to command me. The god of water ${user} forbids this.`);
		return;
	}

	const command = client.commands.get(interaction.commandName);
	// console.log(interaction.member.voice.channel.members.size);

	console.log(interaction.user)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	// FYI: get arguments using: interaction.options._hoistedOptions[0].value

	try {
		if (interaction.commandName === "play") {
			client.queue = await command.execute(interaction, interaction.options._hoistedOptions[0].value, client.queue);
		} else if (interaction.commandName === "skip") {
			client.queue = await command.execute(interaction, client.queue);
		} else {
			await command.execute(interaction);
		}
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'