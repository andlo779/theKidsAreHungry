import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinList')
  handleJoinList(@MessageBody() listId: string, @ConnectedSocket() client: Socket) {
    client.join(`list-${listId}`);
  }

  @SubscribeMessage('leaveList')
  handleLeaveList(@MessageBody() listId: string, @ConnectedSocket() client: Socket) {
    client.leave(`list-${listId}`);
  }

  broadcastItemCreated(listId: string, item: any) {
    this.server.to(`list-${listId}`).emit('itemCreated', item);
  }

  broadcastItemUpdated(listId: string, item: any) {
    this.server.to(`list-${listId}`).emit('itemUpdated', item);
  }

  broadcastItemDeleted(listId: string, itemId: string) {
    this.server.to(`list-${listId}`).emit('itemDeleted', itemId);
  }
}
