import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LicensingService } from './licensing.service';

const MODULE_MAP: Record<string, string> = {
  '/api/customers': 'crm',
  '/api/leads': 'crm',
  '/api/deals': 'crm',
  '/api/accounts': 'accounting',
  '/api/journal-entries': 'accounting',
  '/api/invoices': 'accounting',
  '/api/payments': 'accounting',
  '/api/expenses': 'accounting',
  '/api/reports': 'accounting',
};

@Injectable()
export class LicensingMiddleware implements NestMiddleware {
  constructor(private licensingService: LicensingService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (!user) return next();

    const path = req.path;
    const moduleCode = Object.entries(MODULE_MAP).find(([prefix]) =>
      path.startsWith(prefix),
    )?.[1];

    if (!moduleCode) return next();

    const hasAccess = await this.licensingService.checkLicense(user.userId, moduleCode);
    if (!hasAccess) {
      throw new ForbiddenException('Module not licensed');
    }

    next();
  }
}
