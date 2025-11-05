# Quick Commerce (Custom) — Verma Home

Custom-coded quick commerce stack with:
- **Frontend:** Next.js (TypeScript) — `/frontend`
- **Backend:** NestJS-style Node API + Socket.IO — `/backend`
- **DB:** PostgreSQL via Prisma
- **Live tracking:** WebSockets + webhook ingestion (Porter/Shadowfax/Delhivery adapters)

## Run Locally

### 1) Prereqs
- Node 20+, PostgreSQL 15+, (optional) Redis 7+
- Or use Docker (see `docker-compose.yml`).

### 2) Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev
```

### 3) Frontend
```bash
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open: http://localhost:3000

### 4) Simulate a Webhook
```bash
curl -X POST http://localhost:4000/api/webhooks/porter   -H "Content-Type: application/json"   -d '{"event":"order.out_for_delivery","data":{"order_id":"PRT123","eta":"2025-11-03T15:00:00+05:30","location":{"lat":28.545,"lng":77.205},"driver":{"name":"Rakesh","phone":"+91-9xxxxxxx"}}}'
```

Then visit: http://localhost:3000/track/PRT123

## Deploy
- Frontend → Vercel
- Backend → Render/Fly.io/AWS
- Postgres → Neon/Aiven
- Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` accordingly.
