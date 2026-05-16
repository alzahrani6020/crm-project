import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class LeadsService {
  findAll(userId: string) {
    return prisma.lead.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string, userId: string) {
    return prisma.lead.findFirst({ where: { id, userId } });
  }

  create(data: { title: string; description?: string; source?: string; status?: string; customerId?: string }, userId: string) {
    return prisma.lead.create({ data: { ...data, userId } as any });
  }

  update(id: string, data: Partial<{ title: string; description: string; source: string; status: string; customerId: string }>, userId: string) {
    return prisma.lead.updateMany({ where: { id, userId }, data: data as any });
  }

  remove(id: string, userId: string) {
    return prisma.lead.deleteMany({ where: { id, userId } });
  }
}
