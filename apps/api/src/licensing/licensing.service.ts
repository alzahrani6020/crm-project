import { Injectable } from '@nestjs/common';
import { prisma } from '@crm/database';

@Injectable()
export class LicensingService {
  async checkLicense(userId: string, moduleCode: string): Promise<boolean> {
    const module = await prisma.systemModule.findUnique({ where: { code: moduleCode } });
    if (!module) return false;
    if (module.isCore) return true;

    const license = await prisma.userLicense.findFirst({
      where: {
        userId,
        moduleId: module.id,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    return !!license;
  }

  async getUserModules(userId: string) {
    const modules = await prisma.systemModule.findMany({
      include: {
        licenses: {
          where: {
            userId,
            isActive: true,
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        },
      },
    });

    return modules.map(m => ({
      ...m,
      isLicensed: m.isCore || m.licenses.length > 0,
    }));
  }
}
