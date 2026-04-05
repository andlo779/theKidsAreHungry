import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.user.upsert({
      where: { id: '00000000-0000-0000-0000-000000000000' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Dummy User',
        email: 'dummy@test.com',
        password_hash: 'dummyhash',
      },
    });
  }
}
