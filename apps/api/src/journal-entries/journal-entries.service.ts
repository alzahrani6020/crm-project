import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class JournalEntriesService {
  findAll(userId: string) {
    return prisma.journalEntry.findMany({
      where: { userId },
      include: { lines: { include: { debitAccount: true, creditAccount: true } } },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: string, userId: string) {
    return prisma.journalEntry.findFirst({
      where: { id, userId },
      include: { lines: { include: { debitAccount: true, creditAccount: true } } },
    });
  }

  async create(data: {
    date: string;
    reference?: string;
    description?: string;
    lines: { debitAccountId?: string; creditAccountId?: string; debit?: number; credit?: number; description?: string }[];
  }, userId: string) {
    const totalDebit = data.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + (l.credit || 0), 0);
    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new BadRequestException('Total debit must equal total credit');
    }

    return prisma.journalEntry.create({
      data: {
        date: new Date(data.date),
        reference: data.reference,
        description: data.description,
        totalDebit,
        totalCredit,
        userId,
        lines: {
          create: data.lines.map(line => ({
            debit: line.debit || 0,
            credit: line.credit || 0,
            description: line.description,
            debitAccountId: line.debitAccountId || null,
            creditAccountId: line.creditAccountId || null,
          })),
        },
      },
      include: { lines: true },
    });
  }

  remove(id: string, userId: string) {
    return prisma.journalEntry.deleteMany({ where: { id, userId } });
  }
}
