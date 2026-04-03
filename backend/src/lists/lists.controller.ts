import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ListsService } from './lists.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Request() req: any, @Body() createListDto: Prisma.ShoppingListUncheckedCreateInput) {
    createListDto.created_by_id = req.user.id;
    createListDto.family_id = req.user.family_id;
    return this.listsService.create(createListDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.listsService.findAll(req.user.family_id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.listsService.findOne(id, req.user.family_id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateListDto: Prisma.ShoppingListUpdateInput) {
    return this.listsService.update(id, req.user.family_id, updateListDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.listsService.remove(id, req.user.family_id);
  }
}
