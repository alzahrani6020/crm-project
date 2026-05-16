import { Module } from '@nestjs/common';
import { JournalEntriesService } from './journal-entries.service';
import { JournalEntriesController } from './journal-entries.controller';

@Module({
  providers: [JournalEntriesService],
  controllers: [JournalEntriesController],
})
export class JournalEntriesModule {}
