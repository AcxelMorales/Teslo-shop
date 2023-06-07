import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { User } from '../auth/entities/auth.entity';

interface ConnectedClients {
  [id: string]: {
    socket: Socket,
    user: User
  };
}

@Injectable()
export class MessagesService {

  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async registerClient(client: Socket, userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user
    };
  }

  removeClient(clientId: string): void {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string): string {
    return this.connectedClients[socketId].user.fullName;
  }

  private checkUserConnection(user: User): void {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

}
