console.log('Hello Ricardo!');

require("dotenv").config();
const fs = require('node:fs');
const path = require('node:path');
const { default: axios } = require('axios');
const cheerio = require('cheerio');
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

client.queue = [];
client.player = createAudioPlayer();
client.connection = null;
client.botID = process.env.CLIENT_ID;
client.targetID = '345082365405560834';
client.userLong = '303148517751259147';
client.currentChannelID = '';
client.currentGuildID = '';
client.adapterCreator = '';
client.allVoiceLine = {};
process.setMaxListeners(1)

function speakRandomDota2(allVoiceLine, voiceArray, voiceArray2) {
	var url = voiceArray[Math.floor(Math.random() * voiceArray.length)];

	console.log(voiceArray.length);
	var base64data;
	try {
		axios.get(url, { responseType: 'arraybuffer' }).then(async (response) => {
			const targetFile = './audio.mp3';
			base64data = "data:audio/mp3" + ";base64," + response.data.toString('base64');
			const buffer = Buffer.from(
				base64data.split('base64,')[1],  // only use encoded data after "base64,"
				'base64'
			)
			fs.writeFileSync(targetFile, buffer);
			const player = createAudioPlayer();
			const resource = createAudioResource(targetFile);
			console.log(url);
			const guildId = client.currentGuildID;
			const channelId = client.currentChannelID;
			const adapterCreator = client.adapterCreator;
			if (guildId != '' && channelId != '' && adapterCreator != '') {
				var connection = getVoiceConnection(guildId, channelId);
				if (connection == null) {
					connection = joinVoiceChannel({
						channelId: channelId,
						guildId: guildId,
						adapterCreator: adapterCreator,
						selfDeaf: false
					});
				}

				try {
					let guild = client.guilds.cache.get(guildId);
					let voiceChannel = await guild.channels.fetch(channelId, { force: true })
					let size = voiceChannel.members;
					console.log(`all members: ${size.get(client.targetID)} ${size.get(client.userLong)} ${size.size}`);
					if (size.get(client.userLong) !== undefined) {
						console.log('Long is in voice');
						url = voiceArray2[Math.floor(Math.random() * voiceArray2.length)];
					} else {
						console.log('Long is not in voice');
					}
				} catch (error) {
					console.log(error)
				}


				if (connection == null) {
					console.log("Not in any channel");
				} else {
					if (!("subscription" in connection.state)) {
						if (Math.random() < 0.01) {
							console.log("Initialize Speaking");
							connection.subscribe(player);
							player.play(resource);
						}
					}
					else {
						console.log(connection.state.subscription.player.state.status)
						if ("player" in connection.state.subscription) {
							if (client.queue.length == 0
								&& connection.state.subscription.player.state.status == 'idle'
								&& Math.random() < 0.01) {
								console.log("Speaking");
								connection.subscribe(player);
								player.play(resource);
							}
						}
					}
				}
			}
		});
	} catch (e) {
		console.log(e);
	}
}
// https://borderlands.fandom.com/wiki/Krieg/Quotes
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag} with id ${c.user.id}`);
	axios.get('https://dota2.fandom.com/wiki/Chat_Wheel/Dota_Plus').then((response) => {
		const $ = cheerio.load(response.data);
		const listItems1 = $('audio').find('a').map((i, x) => $(x).attr('href'));
		client.allVoiceLine = { ...client.allVoiceLine, ...listItems1 };
		console.log(`List item count: ${listItems1.length}`);
		axios.get('https://borderlands.fandom.com/wiki/Krieg/Quotes').then((response2) => {
			const $ = cheerio.load(response2.data);
			const listItems2 = $('ul').find('audio').map((i, x) => $(x).attr('src'));
			client.allVoiceLine = { ...client.allVoiceLine, ...listItems2 };
			console.log(`List item count: ${listItems2.length}`);
			setInterval(() => { speakRandomDota2(client.allVoiceLine, listItems1, listItems2) }, 5000);
		})
	})
});

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

	client.currentChannelID = interaction.member.voice.channel.id;
	client.currentGuildID = interaction.guild.id;
	client.adapterCreator = interaction.guild.voiceAdapterCreator;
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