import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [FeedbackController, FeedbackService],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
