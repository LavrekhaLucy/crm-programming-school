import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupController } from './group.controller';
import { GroupEntity } from '../../database/entities/group.entity';
import { GroupService } from './services/group.service';
import { GroupRepository } from '../repository/services/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  providers: [GroupService, GroupRepository],
  controllers: [GroupController],
  exports: [GroupService],
})
export class GroupModule {}
