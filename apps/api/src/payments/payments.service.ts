import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class PaymentsService {
  findAll(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: { invoice: true },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: string, userId: string) {
    return prisma.payment.findFirst({
      where: { id, userId },
      include: { invoice: true },
    });
  }

  create(data: { date: string; amount: number; method?: string; reference?: string; notes?: string; invoiceId?: string }, userId: string) {
    return prisma.payment.create({
      data: {
        date: new Date(data.date),
        amount: data.amount,
        method: data.method as any,
        reference: data.reference,
        notes: data.notes,
        invoiceId: data.invoiceId,
        userId,
      },
      include: { invoice: true },
    });
  }

  remove(id: string, userId: string) {
    return prisma.payment.deleteMany({ where: { id, userId } });
  }
}
