import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class UsersService {
  findAll() {
    return prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } });
  }

  findOne(id: string) {
    return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
  }
}
