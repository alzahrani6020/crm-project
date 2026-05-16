import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.reportsService.getDashboardStats(req.user.userId);
  }

  @Get('trial-balance')
  getTrialBalance(@Request() req) {
    return this.reportsService.getTrialBalance(req.user.userId);
  }

  @Get('profit-loss')
  getProfitAndLoss(@Request() req) {
    return this.reportsService.getProfitAndLoss(req.user.userId);
  }
}
