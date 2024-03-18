const { default: axios } = require('axios');
const cheerio = require('cheerio');
const mimeType = require('mime-types');
const util = require('util');
const fs = require('fs');

const url = 'https://borderlands.fandom.com/wiki/Krieg/Quotes'
axios.get(url).then((response) => {
    console.log("Ngọt vc. Đen - Cho Tôi Lang Thang".length)
    // const $ = cheerio.load(response.data);
    // const listItems = $('ul').find('audio').map((i, x) => $(x).attr('src'));
    // console.log(`List item count: ${listItems.length} ${typeof listItems}`);
    // for (var i = 0; i < listItems.length; i++) {
    //     console.log(`Item: ${i} value: ${listItems[i]}`)
    // }
    // const b64 = "data:audio/mp3;base64," + response.data.toString('base64');
    // // console.log(b64);
    // const buffer = Buffer.from(
    //     b64.split('base64,')[1],  // only use encoded data after "base64,"
    //     'base64'
    // )
    // fs.writeFileSync('./audio.mp3', buffer);
})

console.log("Hello")