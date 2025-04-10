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
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dtos/create-feedback-dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateFeedbackDto } from './dtos/update-feedback-dto'; // Assuming you have this DTO

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async createAdminFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @Request() req: any,
  ) {
    const adminId = req.user.sub;
    return this.feedbackService.createFeedback(createFeedbackDto, adminId);
  }

  @Get(':ideaId')
  async getFeedbackByIdeaId(@Param('ideaId', ParseIntPipe) ideaId: number) {
    return this.feedbackService.getFeedbackByIdeaId(ideaId);
  }

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
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    const updatedFeedback = await this.feedbackService.updateFeedback(
      id,
      updateFeedbackDto,
    );
    return {
      message: `Feedback with ID ${id} updated successfully`,
      updatedFeedback,
    };
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK) // Explicitly set success status to 200
  async deleteFeedback(@Param('id', ParseIntPipe) id: number) {
    await this.feedbackService.deleteFeedback(id);
    return { message: `Feedback with ID ${id} deleted successfully` };
  }
}
