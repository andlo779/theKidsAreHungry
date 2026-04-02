import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListsService } from './lists.service';
import { Prisma } from '@prisma/client';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Body() createListDto: Prisma.ShoppingListUncheckedCreateInput) {
    return this.listsService.create(createListDto);
  }

  @Get()
  findAll() {
    return this.listsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListDto: Prisma.ShoppingListUpdateInput) {
    return this.listsService.update(id, updateListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }
}
