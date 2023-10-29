require("dotenv").config();
const axios = require("axios").default;

const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/translation/language_detection",
    headers: {
        authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`
    },
    data: {
        show_original_response: false,
        fallback_providers: "",
        providers: 'google',
        text: 'Xin chào, tôi là Nam'
    }
}

axios
    .request(options)
    .then((response) => { console.log(response.data.google.items[0].language) })
    .catch((error) => {
        console.error(error);
    });