import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class AccountsService {
  findAll(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      include: { children: true },
      orderBy: { code: 'asc' },
    });
  }

  findOne(id: string, userId: string) {
    return prisma.account.findFirst({
      where: { id, userId },
      include: { children: true, parent: true },
    });
  }

  create(data: { code: string; name: string; type: string; parentId?: string; description?: string; balance?: number }, userId: string) {
    return prisma.account.create({ data: { ...data, userId } as any });
  }

  update(id: string, data: Partial<{ code: string; name: string; type: string; parentId: string; description: string; balance: number; isActive: boolean }>, userId: string) {
    return prisma.account.updateMany({ where: { id, userId }, data: data as any });
  }

  remove(id: string, userId: string) {
    return prisma.account.deleteMany({ where: { id, userId } });
  }
}
