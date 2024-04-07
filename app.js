const http = require('http');
const querystring = require('querystring');
const url = require('url');

class MyClassificationPipeline {
    static task = 'automatic-speech-recognition';
    static model = 'whisper_large_v3';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            // Dynamically import the Transformers.js library
            let { pipeline, env } = await import('@xenova/transformers');

            // NOTE: Uncomment this to change the cache directory
            env.cacheDir = './.cache';

            this.instance = pipeline(this.task, this.model, { local_files_only: true, model_file_name: 'whisper_large_v3' });
        }

        return this.instance;
    }
}

const server = http.createServer();
const hostname = '127.0.0.1';
const port = 3000;

// Listen for requests made to the server
server.on('request', async (req, res) => {
    // Parse the request URL
    const parsedUrl = url.parse(req.url);

    // Extract the query parameters
    const { text } = querystring.parse(parsedUrl.query);

    // Set the response headers
    res.setHeader('Content-Type', 'application/json');

    let response;
    if (parsedUrl.pathname === '/classify' && text) {
        const classifier = await MyClassificationPipeline.getInstance();
        response = await classifier(text);
        res.statusCode = 200;
    } else {
        response = { 'error': 'Bad request' }
        res.statusCode = 400;
    }

    // Send the JSON response
    res.end(JSON.stringify(response));
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});