import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ListStatus } from '@prisma/client';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.ShoppingListUncheckedCreateInput) {
    return this.prisma.shoppingList.create({ data });
  }

  findAll(family_id: string) {
    return this.prisma.shoppingList.findMany({
      where: { family_id, status: ListStatus.ACTIVE },
      include: { items: true, members: true },
    });
  }

  findArchived(family_id: string) {
    return this.prisma.shoppingList.findMany({
      where: { family_id, status: ListStatus.ARCHIVED },
      include: { items: true, members: true },
    });
  }

  findOne(id: string, family_id: string) {
    return this.prisma.shoppingList.findUnique({
      where: { id, family_id, status: ListStatus.ACTIVE },
      include: { items: true, members: true },
    });
  }

  update(id: string, family_id: string, data: Prisma.ShoppingListUpdateInput) {
    return this.prisma.shoppingList.update({ where: { id, family_id }, data });
  }

  unarchive(id: string, family_id: string) {
    return this.prisma.shoppingList.update({
      where: { id, family_id },
      data: { status: ListStatus.ACTIVE },
    });
  }

  remove(id: string, family_id: string) {
    return this.prisma.shoppingList.update({
      where: { id, family_id },
      data: { status: ListStatus.ARCHIVED },
    });
  }

  removePermanent(id: string, family_id: string) {
    return this.prisma.shoppingList.delete({ where: { id, family_id } });
  }
}
