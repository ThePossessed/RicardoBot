const { default: axios } = require('axios');
const cheerio = require('cheerio');
const mimeType = require('mime-types');
const util = require('util');

const url = 'https://dota2.fandom.com/wiki/Chat_Wheel/Dota_Plus'
axios.get(url, { responseType: 'arraybuffer' }).then((response) => {
    const $ = cheerio.load(response.data);
    const listItems = $('audio').find('a').map((i, x) => $(x).attr('href'));
    console.log(`List item count: `);
    // const b64 = response.data.toString('base64');
    // console.log(b64);
})

console.log("Hello")