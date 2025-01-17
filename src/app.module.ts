import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './services/scheduler/scheduler.service';
import { GoogleModule } from './services/google/google.module';
import { ConfigModule } from '@nestjs/config';
import { DexScreenerModule } from './services/dex-screener/dex-screener.module';
import MainController from './api/api.controller';
import MarketRateService from './services/market-rate.service';

@Module({
  controllers: [MainController],
  imports: [
    ConfigModule.forRoot(),
    GoogleModule,
    DexScreenerModule,
    ScheduleModule.forRoot(),
  ],
  providers: [SchedulerService, MarketRateService],
})
export class AppModule {}
