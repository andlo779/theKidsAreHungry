import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.StoreCreateInput) {
    return this.prisma.store.create({ data });
  }

  findAll() {
    return this.prisma.store.findMany();
  }

  findOne(id: string) {
    return this.prisma.store.findUnique({ where: { id } });
  }

  update(id: string, data: Prisma.StoreUpdateInput) {
    return this.prisma.store.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.store.delete({ where: { id } });
  }
}
