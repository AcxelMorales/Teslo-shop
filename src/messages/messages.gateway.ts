import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { JwtService } from '@nestjs/jwt';

import { MessagesService } from './messages.service';

import { NewMessageDto } from './dto/new-message.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.headers.auth as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

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
      fullName: this.messagesService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });

  }

}
