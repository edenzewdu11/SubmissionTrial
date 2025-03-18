import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async createFeedback(@Body() feedbackDto: any) {
    return this.feedbackService.createFeedback(feedbackDto);
  }

  @Get(':ideaId')
  async getFeedbackByIdeaId(@Param('ideaId', ParseIntPipe) ideaId: number) {
    return this.feedbackService.getFeedbackByIdeaId(ideaId);
  }
}
