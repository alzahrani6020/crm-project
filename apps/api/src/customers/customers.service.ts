import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class CustomersService {
  findAll(userId: string) {
    return prisma.customer.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string, userId: string) {
    return prisma.customer.findFirst({ where: { id, userId } });
  }

  create(data: { name: string; email?: string; phone?: string; company?: string; status?: string }, userId: string) {
    return prisma.customer.create({ data: { ...data, userId } as any });
  }

  update(id: string, data: Partial<{ name: string; email: string; phone: string; company: string; status: string }>, userId: string) {
    return prisma.customer.updateMany({ where: { id, userId }, data: data as any });
  }

  remove(id: string, userId: string) {
    return prisma.customer.deleteMany({ where: { id, userId } });
  }
}
