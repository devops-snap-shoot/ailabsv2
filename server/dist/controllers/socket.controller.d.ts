import socketIo from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
declare let s: socketIo.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
declare const SocketController: (server: any) => Promise<void>;
export { s, SocketController };
