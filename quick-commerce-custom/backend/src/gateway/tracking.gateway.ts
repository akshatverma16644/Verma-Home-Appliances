import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class TrackingGateway {
  @WebSocketServer() server!: Server;

  handleConnection(client: Socket) {
    client.on('join', (awb: string) => client.join(`awb:${awb}`));
  }
}
