import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { StoresModule } from './stores/stores.module';
import { ItemsModule } from './items/items.module';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';

@Module({
  imports: [PrismaModule, UsersModule, ListsModule, StoresModule, ItemsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
