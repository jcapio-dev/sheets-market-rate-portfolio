import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './services/scheduler/scheduler.service';
import { GoogleModule } from './services/google/google.module';
import { ConfigModule } from '@nestjs/config';
import { DexScreenerModule } from './services/dex-screener/dex-screener.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GoogleModule,
    DexScreenerModule,
    ScheduleModule.forRoot(),
  ],
  providers: [SchedulerService],
})
export class AppModule {}
