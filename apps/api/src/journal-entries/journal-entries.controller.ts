import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JournalEntriesService } from './journal-entries.service';

@ApiTags('Journal Entries')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('journal-entries')
export class JournalEntriesController {
  constructor(private journalEntriesService: JournalEntriesService) {}

  @Get()
  findAll(@Request() req) {
    return this.journalEntriesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.journalEntriesService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() body: any, @Request() req) {
    return this.journalEntriesService.create(body, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.journalEntriesService.remove(id, req.user.userId);
  }
}
