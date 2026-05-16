import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditService } from './audit.service';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private auditService: AuditService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    const method = req.method;
    const path = req.path;

    if (method !== 'GET' && user) {
      this.auditService.log({
        userId: user.userId,
        action: `${method} ${path}`,
        entity: path.split('/')[2] || 'unknown',
        ip: req.ip,
      }).catch(() => {});
    }

    next();
  }
}
