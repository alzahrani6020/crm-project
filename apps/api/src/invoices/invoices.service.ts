import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class InvoicesService {
  findAll(userId: string) {
    return prisma.invoice.findMany({
      where: { userId },
      include: { customer: true, items: true, payments: true },
      orderBy: { issueDate: 'desc' },
    });
  }

  findOne(id: string, userId: string) {
    return prisma.invoice.findFirst({
      where: { id, userId },
      include: { customer: true, items: true, payments: true },
    });
  }

  async create(data: {
    number: string;
    issueDate: string;
    dueDate: string;
    customerId: string;
    taxRate?: number;
    notes?: string;
    items: { description: string; quantity: number; unitPrice: number }[];
  }, userId: string) {
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxRate = data.taxRate ?? 15;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    return prisma.invoice.create({
      data: {
        number: data.number,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        customerId: data.customerId,
        subtotal,
        taxRate,
        taxAmount,
        total,
        notes: data.notes,
        userId,
        items: {
          create: data.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
  }

  updateStatus(id: string, status: string, userId: string) {
    return prisma.invoice.updateMany({ where: { id, userId }, data: { status: status as any } });
  }

  remove(id: string, userId: string) {
    return prisma.invoice.deleteMany({ where: { id, userId } });
  }
}
