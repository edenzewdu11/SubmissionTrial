import { Module } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { IdeasController } from './ideas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/ideas.entity'; // Assuming you have an Idea entity
import { UsersModule } from '../users/users.module'; // If IdeasService needs to use UsersService, import UsersModule

@Module({
  imports: [TypeOrmModule.forFeature([Idea]), UsersModule], // Import the Idea entity and any other necessary modules
  providers: [IdeasService],
  controllers: [IdeasController],
  exports: [IdeasService],
})
export class IdeasModule {}
