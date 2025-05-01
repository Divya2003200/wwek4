
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from './milestone.entity';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Milestone]), ProjectsModule ],
  providers: [MilestonesService],
  controllers: [MilestonesController],
  exports:[MilestonesService]
})
export class MilestonesModule {}
