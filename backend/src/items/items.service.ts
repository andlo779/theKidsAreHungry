import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ItemsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  async create(data: Prisma.ShoppingItemUncheckedCreateInput) {
    const item = await this.prisma.shoppingItem.create({ data });
    this.eventsGateway.broadcastItemCreated(item.list_id, item);
    return item;
  }

  findAll() {
    return this.prisma.shoppingItem.findMany();
  }

  findOne(id: string) {
    return this.prisma.shoppingItem.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.ShoppingItemUpdateInput) {
    const item = await this.prisma.shoppingItem.update({ where: { id }, data });
    this.eventsGateway.broadcastItemUpdated(item.list_id, item);
    return item;
  }

  async remove(id: string) {
    const item = await this.prisma.shoppingItem.delete({ where: { id } });
    this.eventsGateway.broadcastItemDeleted(item.list_id, id);
    return item;
  }
}
