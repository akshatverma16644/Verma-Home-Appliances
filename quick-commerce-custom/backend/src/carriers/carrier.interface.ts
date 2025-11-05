import { NormalizedEvent } from './types';

export interface CarrierAdapter {
  name: 'PORTER'|'SHADOWFAX'|'DELHIVERY'|'BORZO';
  createShipment?(dto: any): Promise<{ awb: string }>;
  mapWebhook(payload:any, headers?:Record<string,string>): Promise<NormalizedEvent>;
  verifySignature?(payload:string|object, headers:Record<string,string>): Promise<boolean>;
}
