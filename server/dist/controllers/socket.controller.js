"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketController = exports.s = void 0;
const tslib_1 = require("tslib");
const socket_io_1 = (0, tslib_1.__importDefault)(require("socket.io"));
let s;
exports.s = s;
const SocketController = async (server) => {
    console.log('Socket connection');
    const io = new socket_io_1.default.Server(server, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: false
        },
    });
    io.on('connection', (socket) => {
        socket.on('isConnected', async (data) => {
            console.log('Activado!!!', data);
            io.emit('connections', { messagge: 'Is Connected!!!' });
        });
        socket.on('nuevoUsuario', (data) => {
            io.emit(`actualizar_${data._id}`, { title: 'Actualizados usuarios' });
        });
        socket.on('nuevoCliente', (data) => {
            console.log('Nuevo cliente creado');
            /* console.log(data) */
            io.emit(`nuevoClienteCreado_${data._id}`, { title: 'Actualizados clientes' });
        });
    });
    exports.s = s = io;
};
exports.SocketController = SocketController;
//# sourceMappingURL=socket.controller.js.map