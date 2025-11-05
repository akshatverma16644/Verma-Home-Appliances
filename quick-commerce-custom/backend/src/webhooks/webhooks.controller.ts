import { Body, Controller, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('api/webhooks')
export class WebhooksController {
  constructor(private tracking: TrackingService) {}

  @Post(':carrier')
  @HttpCode(200)
  async handle(@Param('carrier') carrier: string, @Body() body: any, @Headers() headers: Record<string,string>) {
    await this.tracking.ingest(carrier.toUpperCase(), body, headers);
    return { ok: true };
  }
}
