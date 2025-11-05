import { CarrierAdapter } from './carrier.interface';
import { NormalizedEvent } from './types';

export class ShadowfaxAdapter implements CarrierAdapter {
  name = 'SHADOWFAX' as const;
  async mapWebhook(payload:any): Promise<NormalizedEvent> {
    const map: Record<string, NormalizedEvent['status']> = {
      'created':'CREATED','accepted':'ACCEPTED','assigned':'ASSIGNED',
      'picked_up':'PICKED_UP','in_transit':'IN_TRANSIT',
      'out_for_delivery':'OUT_FOR_DELIVERY','delivered':'DELIVERED',
      'cancelled':'CANCELLED','failed':'FAILED'
    };
    return {
      carrier: 'SHADOWFAX',
      awb: String(payload?.tracking_id || payload?.awb || 'SFX123'),
      status: map[payload?.event] ?? 'IN_TRANSIT',
      eta: payload?.eta,
      lat: payload?.location?.lat, lng: payload?.location?.lng,
      riderName: payload?.rider?.name, riderPhone: payload?.rider?.phone,
      raw: payload, happenedAt: new Date().toISOString()
    };
  }
}
