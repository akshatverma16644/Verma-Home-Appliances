import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api/track')
export class TrackingController {
  constructor(private prisma: PrismaService) {}

  @Get(':awb')
  async get(@Param('awb') awb: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { awb },
      include: { events: { orderBy: { happenedAt: 'asc' } } }
    });
    if (!shipment) return { ok:false, message:'Not found' };
    return {
      ok: true,
      awb,
      status: shipment.status,
      eta: shipment.eta,
      lastLocation: shipment.lastLat != null && shipment.lastLng != null ? { lat: shipment.lastLat, lng: shipment.lastLng } : null,
      events: shipment.events.map(e => ({ status: e.status, happenedAt: e.happenedAt }))
    };
  }
}
