const http = require('http');
const client = require('prom-client');

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
    name: 'task_manager_http_requests_total',
    help: 'Total HTTP requests received'
});

const server = http.createServer(async (req, res) => {
    if (req.url === '/metrics') {
        httpRequestCounter.inc();

        res.writeHead(200, {
            'Content-Type': client.register.contentType
        });

        res.end(await client.register.metrics());
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, '0.0.0.0', () => {
    console.log('Metrics server running on port 3000');
});
