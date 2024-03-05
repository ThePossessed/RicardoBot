const { Client, SlashCommandBuilder, GatewayIntentBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const ytdl = require('play-dl');
const fetch = require("node-fetch");
const isUrl = require("is-url");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

const gif_list = [
    "https://media.tenor.com/2ozk1b_VfyMAAAAC/ricardo-funny.gif",
    "https://media.tenor.com/fkxejHz1FsUAAAAC/plaqtudum.gif",
    "https://media.tenor.com/m8kD9Q3aNdMAAAAM/ricardo-ricardo-milos.gif",
    "https://media.tenor.com/0jpu-XpzIR8AAAAM/ricardo-milos.gif",
    "https://media.tenor.com/EfumP3h6_V4AAAAM/ricardo-milos-meme.gif",
    "https://media.tenor.com/lq4fUmDePxUAAAAM/ricardo-milos-meme.gif",
    "https://media.tenor.com/ReS3rrgjdkcAAAAM/ricardo-milos-millos.gif",
    "https://media.tenor.com/De1hj81ITmcAAAAM/naruto-ricardo-milos.gif",
    "https://media.tenor.com/oO-Zeqd99WcAAAAM/ricardo-milos-dance.gif",
    "https://media.tenor.com/9xRm-ABqvI0AAAAM/dota-ricardo.gif",
    "https://media.tenor.com/6k-U_rIo6FMAAAAM/ricardo-milos-sexy.gif",
    "https://media.tenor.com/9g4d1XT3EGIAAAAM/ricardo-milos-naruto.gif",
    "https://media.tenor.com/Lxg6C9a7eGoAAAAM/rasen-milos-rasengan.gif"
]

// const secret_image = [
//     "/../assets/Nam_nguyen_rido.jpg",
//     "/../assets/Namrido.jpg"
// ]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendnude')
        .setDescription('send a sexy gif')
    ,
    async execute(interaction) {
        const coinflip = Math.random();

        await interaction.deferReply();

        // if (coinflip < 0.1) {
        //     var randomfile = secret_image[Math.floor(Math.random() * secret_image.length)]
        //     let user = await client.users.fetch('345082365405560834');
        //     let luckyuser = await client.users.fetch(interaction.user.id);

        //     const file = new AttachmentBuilder(__dirname + randomfile);
        //     var filename = randomfile.split("/");
        //     filename = filename[filename.length - 1];

        //     const embedmsg = new EmbedBuilder()
        //         .setImage("attachment://" + filename)


        //     await interaction.reply({ content: `${luckyuser} You lucky bastard! ${user} shall give you his secret nude!`, embeds: [embedmsg], files: [file] })
        //     return;
        // } else {
        var randomgif = gif_list[Math.floor(Math.random() * gif_list.length)]
        let user = await client.users.fetch('345082365405560834');

        const embedmsg = new EmbedBuilder()
            .setImage(randomgif)


        await interaction.editReply({ content: `Your wish is my command. ${user} shall grant you his precious nude.`, embeds: [embedmsg] })
        return;
        // }


        // await interaction.reply(`Your wish is my command. ${user} shall grant you his precious nude.\n${randomgif}`)
    },
};
