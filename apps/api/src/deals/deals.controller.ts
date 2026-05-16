import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DealsService } from './deals.service';

@ApiTags('Deals')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('deals')
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Get()
  findAll(@Request() req) {
    return this.dealsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.dealsService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() body: any, @Request() req) {
    return this.dealsService.create(body, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.dealsService.update(id, body, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.dealsService.remove(id, req.user.userId);
  }
}
