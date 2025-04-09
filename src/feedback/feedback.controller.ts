import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dtos/create-feedback-dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/feedback') // Changed controller route to 'admin/feedback'
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminFeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req: any,
  ) {
    const adminId = req.user.id;
    return this.feedbackService.createFeedback(createFeedbackDto, adminId);
  }

  @Get()
  async getAllFeedback() {
    return this.feedbackService.getAllFeedback();
  }

  @Get(':id')
  async getFeedbackById(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.getFeedbackById(id);
  }

  @Patch(':id')
  async updateFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeedbackDto: any, // Use UpdateFeedbackDto for better typing
  ) {
    return this.feedbackService.updateFeedback(id, updateFeedbackDto);
  }

  @Delete(':id')
  async deleteFeedback(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.deleteFeedback(id);
  }
}

@Controller('feedback') // Keeping the route for fetching feedback by idea ID (potentially public or user-specific)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // This route might be accessible to users to see feedback on a specific idea
  @Get(':ideaId')
  async getFeedbackByIdeaId(@Param('ideaId', ParseIntPipe) ideaId: number) {
    return this.feedbackService.getFeedbackByIdeaId(ideaId);
  }
}
