import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ShoppingListUncheckedCreateInput) {
    return this.prisma.shoppingList.create({ data });
  }

  findAll() {
    return this.prisma.shoppingList.findMany({ include: { items: true, members: true } });
  }

  findOne(id: string) {
    return this.prisma.shoppingList.findUnique({ where: { id }, include: { items: true, members: true } });
  }

  update(id: string, data: Prisma.ShoppingListUpdateInput) {
    return this.prisma.shoppingList.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.shoppingList.delete({ where: { id } });
  }
}
