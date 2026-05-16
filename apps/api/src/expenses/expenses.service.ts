import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class ExpensesService {
  findAll(userId: string) {
    return prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: string, userId: string) {
    return prisma.expense.findFirst({ where: { id, userId } });
  }

  create(data: { date: string; amount: number; category: string; description?: string; receiptUrl?: string }, userId: string) {
    return prisma.expense.create({
      data: {
        date: new Date(data.date),
        amount: data.amount,
        category: data.category,
        description: data.description,
        receiptUrl: data.receiptUrl,
        userId,
      },
    });
  }

  update(id: string, data: Partial<{ date: string; amount: number; category: string; description: string; receiptUrl: string }>, userId: string) {
    const updateData: any = { ...data };
    if (data.date) updateData.date = new Date(data.date);
    return prisma.expense.updateMany({ where: { id, userId }, data: updateData });
  }

  remove(id: string, userId: string) {
    return prisma.expense.deleteMany({ where: { id, userId } });
  }
}
