import express from 'express';
import socketIO from 'socket.io';
import http from 'http';
import { SERVER_PORT } from '../config/general';


export default class Server {
    private static _intance:Server;

    public app: express.Application;
    public port: number;
    // public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        // this.io = new socketIO.Server(this.httpServer);
        this.listenSockets();
    }

    //Si existe una instancia del servidor se retorno, en caso contrario se crea 
    //una nueva, evitando que exista mas de un servidor
    public static get instance(){
        return this._intance || (this._intance = new this());
    }

    listenSockets() {
        console.log('Escuchando sockets');
        // this.io.on('connection', client => {
        //     console.log('Cliente conectado a socket');
        //     console.log(client.id);
        // });
    }

    start(callback: any) {
        this.httpServer.listen(this.port, callback);
    }
}