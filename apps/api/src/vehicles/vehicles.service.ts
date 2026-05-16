import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class VehiclesService {
  findAll(userId: string) {
    return prisma.vehicle.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string, userId: string) {
    return prisma.vehicle.findFirst({ where: { id, userId } });
  }

  create(data: any, userId: string) {
    return prisma.vehicle.create({ data: { ...data, userId } as any });
  }

  update(id: string, data: any, userId: string) {
    return prisma.vehicle.updateMany({ where: { id, userId }, data: data as any });
  }

  remove(id: string, userId: string) {
    return prisma.vehicle.deleteMany({ where: { id, userId } });
  }
}
