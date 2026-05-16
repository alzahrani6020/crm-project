import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class MaintenanceService {
  findAll(userId: string) {
    return prisma.maintenance.findMany({
      where: { userId },
      include: { vehicle: true },
      orderBy: { date: 'desc' },
    });
  }

  create(data: any, userId: string) {
    return prisma.maintenance.create({ data: { ...data, userId } as any });
  }

  remove(id: string, userId: string) {
    return prisma.maintenance.deleteMany({ where: { id, userId } });
  }
}
