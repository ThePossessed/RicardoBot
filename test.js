const { default: axios } = require('axios');
const cheerio = require('cheerio');
const mimeType = require('mime-types');
const util = require('util');
const fs = require('fs');

const url = 'https://static.wikia.nocookie.net/dota2_gamepedia/images/0/01/Vo_abaddon_abad_laugh_03.mp3/revision/latest?cb=20201004184340'
axios.get(url, { responseType: 'arraybuffer' }).then((response) => {
    // const $ = cheerio.load(response.data);
    // const listItems = $('audio').find('a').map((i, x) => $(x).attr('href'));
    // console.log(`List item count: ${listItems[0]}`);
    const b64 = "data:audio/mp3;base64," + response.data.toString('base64');
    // console.log(b64);
    const buffer = Buffer.from(
        b64.split('base64,')[1],  // only use encoded data after "base64,"
        'base64'
    )
    fs.writeFileSync('./audio.mp3', buffer);
})

console.log("Hello")