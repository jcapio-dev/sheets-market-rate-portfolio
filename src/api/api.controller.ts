import { Controller, Get, Query, Res } from '@nestjs/common';
import MarketRateService from 'src/services/market-rate.service';

@Controller('api')
export default class MainController {
  constructor(private readonly marketRateService: MarketRateService) {
    console.log('MainController created');
  }

  @Get('update-sheets')
  async updateSheets(@Res() res, @Query('key') key: string) {
    if (key !== process.env.API_KEY) {
      res.status(401).send('Unauthorized');
      return;
    }
    await this.marketRateService.updateMarketRateReport();
    res.send('Sheets Updated');
  }
}
