export type NormalizedEvent = {
  carrier: 'PORTER'|'SHADOWFAX'|'DELHIVERY'|'BORZO';
  awb: string;
  status: 'CREATED'|'ACCEPTED'|'ASSIGNED'|'PICKED_UP'|'IN_TRANSIT'|'OUT_FOR_DELIVERY'|'DELIVERED'|'FAILED'|'CANCELLED';
  eta?: string;
  lat?: number; lng?: number;
  riderName?: string; riderPhone?: string;
  raw: any;
  happenedAt?: string;
};
