const fs = require('fs');

const routesHandler = (request, response) => {
    const url = request.url;
    const method = request.method;

    console.log('url', url);
    if (url === '/') {
        response.setHeader('Content-Type', 'text/html');
        response.write(`
        <html>
            <head>
                <title>Server</title>
            </head>
            <body>
                <form action="/create" novalidate method="POST">
                    <input type="text" id="message" name="message" multiple>
                    <button type="submit">Create</button>
                </form>
            </body>
        </html>`);
        return response.end();
    } else if (url === '/create' && method === 'POST') {
        const body = [];
        request.on('data', (chunk) => {
            console.log('chunk', chunk);
            body.push(chunk);
        });
        return request.on('end', (chunk) => {
            const parsedBody = Buffer.concat(body).toString();
            console.log('parsedBody', parsedBody);
            const message = parsedBody.split("=")[1];
            fs.writeFile('message.txt', message, err => {
                response.statusCode = 302;
                response.setHeader('Location', '/');
                return response.end();
            });
        });
    }

    response.setHeader('Content-Type', 'text/html');
    response.write(`
    <html>
        <head>
            <title>Server</title>
        </head>
        <body>
            <h1>Node.js!</h1>
        </body>
    </html>`);
    response.end();
}

module.exports = routesHandler;