import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class ShipmentsService {
  findAll(userId: string) {
    return prisma.shipment.findMany({
      where: { userId },
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string, userId: string) {
    return prisma.shipment.findFirst({
      where: { id, userId },
      include: { vehicle: true, driver: true, routes: true },
    });
  }

  create(data: any, userId: string) {
    return prisma.shipment.create({ data: { ...data, userId } as any });
  }

  update(id: string, data: any, userId: string) {
    return prisma.shipment.updateMany({ where: { id, userId }, data: data as any });
  }

  remove(id: string, userId: string) {
    return prisma.shipment.deleteMany({ where: { id, userId } });
  }
}
