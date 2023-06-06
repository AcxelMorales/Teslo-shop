import { Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

interface ConnectedClients {
  [id: string]: Socket;
}

@Injectable()
export class MessagesService {

  private connectedClients: ConnectedClients = {};

  registerClient(client: Socket): void {
    this.connectedClients[client.id] = client;
  }

  removeClient(clientId: string): void {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }

}
