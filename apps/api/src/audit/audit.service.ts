import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class AuditService {
  async log(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    oldData?: any;
    newData?: any;
    ip?: string;
  }) {
    return prisma.auditLog.create({ data });
  }

  findAll(userId: string) {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
