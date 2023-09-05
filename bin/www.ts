#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import Debug from 'debug'

const debug = Debug('ws-endpoints:server');
import http from 'http';

/**
 * Get port from environment and store in Express.
 */

// @ts-ignore
const port: number | string | false = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);


import {Server} from "socket.io";

const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.of("/").on("connection", (socket) => {
    console.log(`[/    ] a user connected ${socket.id}`);

    socket.join('room1');

    socket.on('disconnect', () => {
        console.log(`[/    ] user disconnected ${socket.id}`);
    })
});

io.of("/hoge").on('connection', (socket) => {
    // console.log(socket);
    console.log(`[/hoge] a user connected ${socket.id}`);

    socket.join("room1");

    socket.on('disconnect', () => {
        console.log(`[/hoge] user disconnected ${socket.id}`);
    })
});

setInterval(() => {
    io.of("/hoge").to('room1').emit('message', 'hello to /hoge room1');
}, 2000);

setInterval(() => {
    io.of("/").to('room1').emit('message', 'hello to / room1');
}, 2000);

server.listen(3000, () => {
    console.log('listening on *:3000');
});


/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: number | string) {
    const port: number = parseInt('' + val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind: string = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr: any = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        // @ts-ignore
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
