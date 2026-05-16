import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class DriversService {
  findAll(userId: string) {
    return prisma.driver.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string, userId: string) {
    return prisma.driver.findFirst({ where: { id, userId } });
  }

  create(data: any, userId: string) {
    return prisma.driver.create({ data: { ...data, userId } as any });
  }

  update(id: string, data: any, userId: string) {
    return prisma.driver.updateMany({ where: { id, userId }, data: data as any });
  }

  remove(id: string, userId: string) {
    return prisma.driver.deleteMany({ where: { id, userId } });
  }
}
