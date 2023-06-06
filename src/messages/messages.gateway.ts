import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket): void {
    this.messagesService.registerClient(client);
  }
  handleDisconnect(client: any): void {
    this.messagesService.removeClient(client.id);
  }

}
