import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesService } from './messages.service';

import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket): void {
    this.messagesService.registerClient(client);
    // Emitir a todos
    this.wss.emit('clients-updated', this.messagesService.getConnectedClients());
  }

  handleDisconnect(client: Socket): void {
    this.messagesService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesService.getConnectedClients());
  }

  @SubscribeMessage('message-client')
  handleMessageClient(client: Socket, payload: NewMessageDto): void {
    // Emitir únicamente al cliente
    // client.emit('message-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });

    // Emitir a todos menos al cliente inicial
    // client.broadcast.emit('message-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message'
    // });

    this.wss.emit('message-server', {
      fullName: client.id,
      message: payload.message || 'no-message'
    });

  }

}
