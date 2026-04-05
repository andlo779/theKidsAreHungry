import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updatePassword(id: string, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('User not found');
    
    const isValid = await bcrypt.compare(oldPass, user.password_hash);
    if (!isValid) throw new BadRequestException('Incorrect old password');
    
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(newPass, salt);
    
    return this.prisma.user.update({ where: { id }, data: { password_hash } });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
