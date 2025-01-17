import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import MarketRateService from '../market-rate.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly marketRateService: MarketRateService) {}

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'updateMarketRateReport',
  })
  async updateMarketRateReport() {
    await this.marketRateService.updateMarketRateReport();
  }
}
