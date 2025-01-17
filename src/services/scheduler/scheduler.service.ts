import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleSheetsService } from '../google/services/sheets.service';
import { DexScreenerService } from '../dex-screener/dex-screener.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly googleSheets: GoogleSheetsService,
    private readonly dex: DexScreenerService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'test',
  })
  async handleCron() {
    this.logger.debug('Called every 30 seconds');

    const { data } = await this.googleSheets.getValues(
      process.env.SHEETS_ID,
      'Sheet1!A2:A99',
    );

    const values = [];

    for (let i = 0; i < data.values.length; i++) {
      const contractAddress = data.values[i].toString();
      const result = await this.dex.fetchTokenDetails(contractAddress);
      const tokenDetails = result.data.find(
        (result) => result.chainId === process.env.CHAIN_ID.toLocaleLowerCase(),
      );

      const sheetIndex = i + 2;
      if (!tokenDetails) {
        values.push({
          range: `Sheet1!B${sheetIndex}`,
          values: [['Not Found']],
        });
        values.push({
          range: `Sheet1!C${sheetIndex}`,
          values: [['Not Found']],
        });
      } else {
        const { marketCap, priceUsd } = tokenDetails;
        values.push({
          range: `Sheet1!B${sheetIndex}`,
          values: [[priceUsd]],
        });
        values.push({
          range: `Sheet1!C${sheetIndex}`,
          values: [[marketCap]],
        });
      }
    }

    await this.googleSheets.update(process.env.SHEETS_ID, values);
    this.logger.debug('Updated Google Sheets');
  }
}
