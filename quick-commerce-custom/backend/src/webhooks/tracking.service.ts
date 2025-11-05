import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TrackingGateway } from '../gateway/tracking.gateway';
import { CarrierAdapter } from '../carriers/carrier.interface';

@Injectable()
export class TrackingService {
  constructor(
    private prisma: PrismaService,
    private gateway: TrackingGateway,
    @Inject('CARRIERS') private adapters: CarrierAdapter[],
  ) {}

  private adapter(name: string) {
    const a = this.adapters.find(a => a.name === name);
    if (!a) throw new NotFoundException('Unknown carrier');
    return a;
  }

  async ingest(carrier: string, payload: any, headers: Record<string,string>) {
    const a = this.adapter(carrier);
    const ev = await a.mapWebhook(payload, headers);

    let shipment = await this.prisma.shipment.findUnique({ where: { awb: ev.awb } });
    if (!shipment) {
      shipment = await this.prisma.shipment.create({
        data: { awb: ev.awb, carrier: carrier as any, mode: 'HYPERLOCAL' }
      });
    }

    await this.prisma.shipment.update({
      where: { awb: ev.awb },
      data: {
        status: ev.status as any,
        eta: ev.eta ? new Date(ev.eta) : undefined,
        lastLat: ev.lat ?? undefined, lastLng: ev.lng ?? undefined,
        events: { create: { status: ev.status as any, raw: ev.raw, happenedAt: ev.happenedAt ? new Date(ev.happenedAt) : undefined } }
      }
    });

    this.gateway.server.to(`awb:${ev.awb}`).emit('tracking:update', ev);
  }
}
