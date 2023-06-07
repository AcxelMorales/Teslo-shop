import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket): void {
    this.messagesService.registerClient(client);
    this.wss.emit('clients-updated', this.messagesService.getConnectedClients());
  }

  handleDisconnect(client: Socket): void {
    this.messagesService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesService.getConnectedClients());
  }

}
