import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DexScreenerService {
  private readonly logger = new Logger(DexScreenerService.name);

  constructor(private readonly service: HttpService) {}

  fetchTokenDetails(tokenAddress: string) {
    const uri = [
      process.env.DEX_SCREENER_URI,
      process.env.CHAIN_ID,
      tokenAddress,
    ].join('/');
    return this.service.get(uri).toPromise();
  }
}
