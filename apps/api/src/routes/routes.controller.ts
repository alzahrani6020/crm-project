import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoutesService } from './routes.service';

@ApiTags('Routes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('routes')
export class RoutesController {
  constructor(private routesService: RoutesService) {}

  @Get('shipment/:shipmentId')
  findAll(@Param('shipmentId') shipmentId: string, @Request() req) {
    return this.routesService.findAllByShipment(shipmentId, req.user.userId);
  }

  @Post('shipment/:shipmentId')
  create(@Param('shipmentId') shipmentId: string, @Body() body: any, @Request() req) {
    return this.routesService.create(body, shipmentId, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.routesService.remove(id, req.user.userId);
  }
}
