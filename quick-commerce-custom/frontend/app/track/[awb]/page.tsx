'use client';
import { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';

type ApiResp = {
  ok: boolean;
  awb: string;
  status: string;
  eta?: string;
  lastLocation?: { lat:number; lng:number } | null;
  events: { status:string; happenedAt:string }[];
};

export default function TrackPage({ params }: { params: { awb: string } }) {
  const { awb } = params;
  const [data, setData] = useState<ApiResp | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/track/${awb}`)
      .then(r => r.json()).then(setData);
  }, [awb]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || '');
    socket.emit('join', awb);
    socket.on('tracking:update', (ev:any) => {
      setData(prev => prev ? {
        ...prev,
        status: ev.status,
        eta: ev.eta ?? prev.eta,
        lastLocation: ev.lat && ev.lng ? { lat: ev.lat, lng: ev.lng } : prev.lastLocation,
        events: [...prev.events, { status: ev.status, happenedAt: ev.happenedAt || new Date().toISOString() }]
      } : prev);
    });
    return () => socket.disconnect();
  }, [awb]);

  const steps = useMemo(() => (['CREATED','ACCEPTED','ASSIGNED','PICKED_UP','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED']), []);

  if (!data) return <div style={{padding:24}}>Loading tracking…</div>;

  return (
    <div style={{maxWidth:900, margin:'20px auto', padding:'0 16px'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h1>Order Tracking</h1>
          <div style={{color:'#666'}}>AWB: {data.awb}</div>
        </div>
        <span style={{padding:'6px 10px', borderRadius:999, background:'#c00', color:'#fff'}}>
          {data.status.replaceAll('_',' ')}
        </span>
      </header>

      <section style={{border:'1px solid #eee', borderRadius:8, padding:16, marginTop:16}}>
        <h3>Delivery Progress</h3>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {steps.map(s => (
            <span key={s} style={{padding:'4px 8px', borderRadius:6, background: s===data.status ? '#c00' : '#f2f2f2', color: s===data.status ? '#fff':'#333'}}>
              {s.replaceAll('_',' ')}
            </span>
          ))}
        </div>
        <div style={{marginTop:8, color:'#666'}}>ETA: {data.eta ? new Date(data.eta).toLocaleString() : '—'}</div>
      </section>

      <section style={{border:'1px solid #eee', borderRadius:8, marginTop:16, overflow:'hidden'}}>
        <div style={{height:300, display:'flex', alignItems:'center', justifyContent:'center', background:'#fafafa'}}>
          {data.lastLocation
            ? <span>Rider location: {data.lastLocation.lat.toFixed(5)}, {data.lastLocation.lng.toFixed(5)}</span>
            : <span>No live location yet</span>}
        </div>
      </section>

      <section style={{border:'1px solid #eee', borderRadius:8, padding:16, marginTop:16}}>
        <h3>Timeline</h3>
        <ul>
          {data.events.map((e, i) => (
            <li key={i}>
              <b>{e.status.replaceAll('_',' ')}</b>
              <span style={{color:'#666'}}> — {new Date(e.happenedAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
