import { Module } from '@nestjs/common';
import { TrackingGateway } from './gateway/tracking.gateway';
import { WebhooksController } from './webhooks/webhooks.controller';
import { TrackingService } from './webhooks/tracking.service';
import { PrismaService } from './prisma.service';
import { TrackingController } from './tracking/tracking.controller';

// Carrier adapters
import { PorterAdapter } from './carriers/porter.adapter';
import { ShadowfaxAdapter } from './carriers/shadowfax.adapter';
import { DelhiveryAdapter } from './carriers/delhivery.adapter';

@Module({
  controllers: [WebhooksController, TrackingController],
  providers: [
    TrackingGateway,
    TrackingService,
    PrismaService,
    PorterAdapter,
    ShadowfaxAdapter,
    DelhiveryAdapter,
    {
      provide: 'CARRIERS',
      useFactory: (p: PorterAdapter, s: ShadowfaxAdapter, d: DelhiveryAdapter) => [p, s, d],
      inject: [PorterAdapter, ShadowfaxAdapter, DelhiveryAdapter],
    },
  ],
})
export class AppModule {}
