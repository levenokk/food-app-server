import { Module } from '@nestjs/common';
import { FillingsService } from './fillings.service';
import { FillingsResolver } from './fillings.resolver';

@Module({
  providers: [FillingsService, FillingsResolver]
})
export class FillingsModule {}
