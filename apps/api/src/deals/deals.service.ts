import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class DealsService {
  findAll(userId: string) {
    return prisma.deal.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string, userId: string) {
    return prisma.deal.findFirst({ where: { id, userId } });
  }

  create(data: { title: string; description?: string; value?: number; status?: string; customerId?: string }, userId: string) {
    return prisma.deal.create({ data: { ...data, userId } as any });
  }

  update(id: string, data: Partial<{ title: string; description: string; value: number; status: string; customerId: string }>, userId: string) {
    return prisma.deal.updateMany({ where: { id, userId }, data: data as any });
  }

  remove(id: string, userId: string) {
    return prisma.deal.deleteMany({ where: { id, userId } });
  }
}
