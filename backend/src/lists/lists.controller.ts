import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthRequest } from '../types';

@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(
    @Request() req: AuthRequest,
    @Body() createListDto: Prisma.ShoppingListUncheckedCreateInput,
  ) {
    createListDto.created_by_id = req.user.id;
    createListDto.family_id = req.user.family_id;
    return this.listsService.create(createListDto);
  }

  @Get()
  findAll(@Request() req: AuthRequest) {
    if (!req.user.family_id) return [];
    return this.listsService.findAll(req.user.family_id);
  }

  @Get('archived')
  findArchived(@Request() req: AuthRequest) {
    if (!req.user.family_id) return [];
    return this.listsService.findArchived(req.user.family_id);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    if (!req.user.family_id) return null;
    return this.listsService.findOne(id, req.user.family_id);
  }

  @Patch(':id/unarchive')
  unarchive(@Request() req: AuthRequest, @Param('id') id: string) {
    if (!req.user.family_id) throw new Error('No family');
    return this.listsService.unarchive(id, req.user.family_id);
  }

  @Patch(':id')
  update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updateListDto: Prisma.ShoppingListUpdateInput,
  ) {
    if (!req.user.family_id) throw new Error('No family');
    return this.listsService.update(id, req.user.family_id, updateListDto);
  }

  @Delete(':id/permanent')
  removePermanent(@Request() req: AuthRequest, @Param('id') id: string) {
    if (!req.user.family_id) throw new Error('No family');
    return this.listsService.removePermanent(id, req.user.family_id);
  }

  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    if (!req.user.family_id) throw new Error('No family');
    return this.listsService.remove(id, req.user.family_id);
  }
}
