import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { UsersModule } from '../users/users.module';
import { IdeasModule } from 'src/ideas/ideas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), UsersModule, IdeasModule], // Import Feedback entity and other needed modules
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
