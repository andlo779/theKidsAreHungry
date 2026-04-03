import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ShoppingListUncheckedCreateInput) {
    return this.prisma.shoppingList.create({ data });
  }

  findAll(family_id: string) {
    return this.prisma.shoppingList.findMany({ where: { family_id }, include: { items: true, members: true } });
  }

  findOne(id: string, family_id: string) {
    return this.prisma.shoppingList.findUnique({ where: { id, family_id }, include: { items: true, members: true } });
  }

  update(id: string, family_id: string, data: Prisma.ShoppingListUpdateInput) {
    return this.prisma.shoppingList.update({ where: { id, family_id }, data });
  }

  remove(id: string, family_id: string) {
    return this.prisma.shoppingList.delete({ where: { id, family_id } });
  }
}
