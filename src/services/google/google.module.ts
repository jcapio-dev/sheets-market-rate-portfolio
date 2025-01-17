import { Global, Module } from '@nestjs/common';
import { GoogleSheetsService } from './services/sheets.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  providers: [GoogleSheetsService],
  exports: [GoogleSheetsService],
})
export class GoogleModule {}
