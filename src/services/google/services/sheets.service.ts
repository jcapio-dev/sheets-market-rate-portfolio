import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as path from 'path';

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);

  async client() {
    const baseAuth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google.config.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const auth = await baseAuth.getClient();
    return google.sheets({ version: 'v4', auth } as any).spreadsheets;
  }

  async getSpreadsheet(spreadsheetId: string) {
    this.logger.debug('Getting spreadsheet');
    return this.client().then((client) =>
      client.get({
        spreadsheetId,
      }),
    );
  }

  async update(id: string, data: any[]) {
    const client = await this.client();
    return client.values.batchUpdate({
      spreadsheetId: id,
      requestBody: {
        valueInputOption: 'RAW',
        data,
      },
    });
  }

  async getValues(SHEETS_ID: string, range: string) {
    const client = await this.client();
    return client.values.get({
      spreadsheetId: SHEETS_ID,
      range,
    });
  }
}
