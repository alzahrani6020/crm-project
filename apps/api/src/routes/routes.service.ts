import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class RoutesService {
  findAllByShipment(shipmentId: string, userId: string) {
    return prisma.route.findMany({
      where: { shipmentId, shipment: { userId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: any, shipmentId: string, userId: string) {
    return prisma.route.create({
      data: { ...data, shipmentId } as any,
    });
  }

  remove(id: string, userId: string) {
    return prisma.route.deleteMany({
      where: { id, shipment: { userId } },
    });
  }
}
