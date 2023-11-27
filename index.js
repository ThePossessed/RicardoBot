console.log('Hello Ricardo!');

require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, IntentsBitField, ClientPresence, Presence } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection, EndBehaviorType } = require('@discordjs/voice');
const prism = require("prism-media");
const { initiateConnection } = require("./utils/HelperFunction/initiateConnection")

require('events').EventEmitter.prototype._maxListeners = 100;

const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, myIntents] });

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
	console.log(`Ready! Logged in as ${c.user.tag} with id ${c.user.id}`);
});

client.queue = [];
client.player = createAudioPlayer();
client.connection = null;
client.botID = '1082531882291445850';
client.targetID = '345082365405560834';
process.setMaxListeners(1)


client.on('voiceStateUpdate', async (oldState, newState) => {
	const actor = newState.member.id;

	// Someone quits a voice channel
	if (newState.channelId === null) {
		console.log('user left channel', oldState.channelId);
		const guildId = oldState.guild.id;
		const voiceId = oldState.channelId;
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
				const connection = getVoiceConnection(guildId);
				if (connection != null) {
					connection.destroy();
				}
			} catch (error) {
				console.log(error)
			}
		} else {

		}
	}

	// Bot action
	if (actor == client.botID) {
		// Bot join a channel
		if (newState.channelId !== null) {

		}
	}

	// Minam action
	else if (actor != client.botID && actor == client.targetID) {
		// console.log(newState)
		if (newState.channelId === null) {
			console.log('user left channel', oldState.channelId);
		}
		else if (oldState.channelId === null) {
			console.log('user joined channel', newState.channelId);
			const connection = initiateConnection(newState.channelId, newState.guild.id, newState.guild.voiceAdapterCreator)
		}
		else {
			console.log('user moved channels', oldState.channelId, newState.channelId);
			const connection = initiateConnection(newState.channelId, newState.guild.id, newState.guild.voiceAdapterCreator)
		}
	}
});

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
	var args;
	if (typeof interaction.options._hoistedOptions[0] === "undefined") {
		args = '';
	} else {
		args = interaction.options._hoistedOptions[0].value;
	}

	try {
		if (interaction.commandName === "play") {
			client.queue = await command.execute(interaction, args, client.queue);
		} else if (interaction.commandName === "skip") {
			client.queue = await command.execute(interaction, client.queue);
		} else if (interaction.commandName === "speak") {
			await command.execute(interaction, args)
			client.queue = []
		}
		else {
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