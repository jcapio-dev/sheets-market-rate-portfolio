import { Injectable, Logger } from '@nestjs/common';
import { GoogleSheetsService } from './google/services/sheets.service';
import { DexScreenerService } from './dex-screener/dex-screener.service';

@Injectable()
export default class MarketRateService {
  private readonly logger = new Logger(MarketRateService.name);
  constructor(
    private readonly googleSheets: GoogleSheetsService,
    private readonly dex: DexScreenerService,
  ) {}
  async updateMarketRateReport() {
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

      values.push({
        range: `Sheet1!D11`,
        values: [[new Date().toISOString()]],
      });
    }

    await this.googleSheets.update(process.env.SHEETS_ID, values);
    this.logger.debug('Updated Google Sheets');
  }
}
