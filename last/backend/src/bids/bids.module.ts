// src/bids/bids.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bids.entity';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Bid]), ProjectsModule ],
  providers: [BidsService],
  controllers: [BidsController],
})
export class BidsModule {}
