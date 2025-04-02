import { Module } from '@nestjs/common';
import { ReferentialsService } from './referentials.service';
import { ReferentialsController } from './referentials.controller';

@Module({
  providers: [ReferentialsService],
  controllers: [ReferentialsController],
  exports: [ReferentialsService],
})
export class ReferentialsModule {}