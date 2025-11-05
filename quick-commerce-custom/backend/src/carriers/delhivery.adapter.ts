import { CarrierAdapter } from './carrier.interface';
import { NormalizedEvent } from './types';

export class DelhiveryAdapter implements CarrierAdapter {
  name = 'DELHIVERY' as const;
  async mapWebhook(payload:any): Promise<NormalizedEvent> {
    const scans = Array.isArray(payload?.Scans) ? payload.Scans : [];
    const last = scans.length ? scans[scans.length-1] : payload;
    const map: Record<string, NormalizedEvent['status']> = {
      'Manifested':'CREATED','Picked Up':'PICKED_UP','In Transit':'IN_TRANSIT',
      'Out For Delivery':'OUT_FOR_DELIVERY','Delivered':'DELIVERED',
      'Undelivered':'FAILED','RTO Initiated':'FAILED','Cancelled':'CANCELLED'
    };
    const scanType = last?.ScanDetail?.ScanType || last?.Status;
    return {
      carrier: 'DELHIVERY',
      awb: String(payload?.AWB || payload?.waybill || 'DLV123'),
      status: map[scanType] ?? 'IN_TRANSIT',
      eta: payload?.ETA,
      raw: payload,
      happenedAt: last?.ScanDetail?.ScanDateTime || new Date().toISOString()
    };
  }
}
