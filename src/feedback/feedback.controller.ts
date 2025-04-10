import {
  Controller,
  Post,
  Body,
  Get,
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

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('admin') // Route for admins to create feedback
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async createAdminFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req: any,
  ) {
    const adminId = req.user.sub;
    return this.feedbackService.createFeedback(createFeedbackDto, adminId);
  }

  // This route might be accessible to users to see feedback on a specific idea
  @Get(':ideaId')
  async getFeedbackByIdeaId(@Param('ideaId', ParseIntPipe) ideaId: number) {
    return this.feedbackService.getFeedbackByIdeaId(ideaId);
  }

  // Admin-specific routes (optional, kept here for convenience)
  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async getAllFeedback() {
    return this.feedbackService.getAllFeedback();
  }

  @Get('admin/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async getFeedbackById(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.getFeedbackById(id);
  }

  @Patch('admin/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async updateFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeedbackDto: any, // Consider using a specific UpdateFeedbackDto
  ) {
    return this.feedbackService.updateFeedback(id, updateFeedbackDto);
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async deleteFeedback(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.deleteFeedback(id);
  }
}
