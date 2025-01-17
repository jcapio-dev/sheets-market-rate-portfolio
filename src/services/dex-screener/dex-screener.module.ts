import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DexScreenerService } from './dex-screener.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [DexScreenerService],
  exports: [DexScreenerService],
})
export class DexScreenerModule {}
