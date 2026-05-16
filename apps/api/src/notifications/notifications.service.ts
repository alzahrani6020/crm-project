import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class NotificationsService {
  findAll(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  findUnread(userId: string) {
    return prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: { userId: string; title: string; message: string; type?: string; link?: string }) {
    return prisma.notification.create({ data });
  }

  markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async checkDueInvoices(userId: string) {
    const dueInvoices = await prisma.invoice.findMany({
      where: {
        userId,
        status: { in: ['SENT', 'OVERDUE'] },
        dueDate: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      },
    });

    for (const inv of dueInvoices) {
      await prisma.notification.upsert({
        where: { id: `inv-due-${inv.id}` },
        update: {},
        create: {
          id: `inv-due-${inv.id}`,
          userId,
          title: 'فاتورة مستحقة',
          message: `الفاتورة ${inv.number} مستحقة السداد خلال 3 أيام`,
          type: 'warning',
          link: `/invoices/${inv.id}`,
        },
      });
    }
  }
}
