import { CarrierAdapter } from './carrier.interface';
import { NormalizedEvent } from './types';

export class PorterAdapter implements CarrierAdapter {
  name = 'PORTER' as const;
  async mapWebhook(payload:any): Promise<NormalizedEvent> {
    const statusMap: Record<string, NormalizedEvent['status']> = {
      'order.created': 'CREATED',
      'order.accepted': 'ACCEPTED',
      'order.assigned': 'ASSIGNED',
      'order.pickedup': 'PICKED_UP',
      'order.intransit': 'IN_TRANSIT',
      'order.out_for_delivery': 'OUT_FOR_DELIVERY',
      'order.delivered': 'DELIVERED',
      'order.cancelled': 'CANCELLED',
      'order.failed': 'FAILED'
    };
    const ev = payload?.event || '';
    return {
      carrier: 'PORTER',
      awb: String(payload?.data?.order_id ?? payload?.order_id ?? 'PRT123'),
      status: statusMap[ev] ?? 'IN_TRANSIT',
      eta: payload?.data?.eta,
      lat: payload?.data?.location?.lat, lng: payload?.data?.location?.lng,
      riderName: payload?.data?.driver?.name, riderPhone: payload?.data?.driver?.phone,
      raw: payload, happenedAt: new Date().toISOString(),
    };
  }
}
