import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { IdeasService } from '../ideas/ideas.service';
import { CreateFeedbackDto } from './dtos/create-feedback-dto';
import { UpdateFeedbackDto } from './dtos/update-feedback-dto';
import { FeedbackStatus } from './entities/feedback.entity'; // Make sure this import is correct

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
    private readonly ideasService: IdeasService,
  ) {}

  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
    adminId: number,
  ): Promise<Feedback> {
    const idea = await this.ideasService.getIdeaById(createFeedbackDto.ideaId);
    if (!idea) throw new NotFoundException('Idea not found');

    const feedback = this.feedbackRepo.create({
      ...createFeedbackDto,
      admin: { id: adminId },
      idea: { id: createFeedbackDto.ideaId },
      status: createFeedbackDto.status || FeedbackStatus.Reviewed, // Ensure 'Reviewed' matches enum value
    });

    return this.feedbackRepo.save(feedback);
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return this.feedbackRepo.find({
      relations: ['admin', 'idea'],
      withDeleted: false,
    });
  }

  async getFeedbackById(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepo.findOne({
      where: { id: { $eq: id } } as any, // Try this explicit syntax and type casting
      relations: ['admin', 'idea'],
      withDeleted: false,
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async updateFeedback(
    id: number,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const feedback = await this.feedbackRepo.findOne({
      where: { id: { $eq: id } } as any,
    }); // Try this
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    this.feedbackRepo.merge(feedback, updateFeedbackDto);
    return this.feedbackRepo.save(feedback);
  }

  async deleteFeedback(id: number): Promise<void> {
    const feedback = await this.feedbackRepo.findOne({
      where: { id: { $eq: id } } as any,
    }); // Try this
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    await this.feedbackRepo.softDelete(id);
  }
  async getFeedbackByIdeaId(ideaId: number): Promise<Feedback[]> {
    return this.feedbackRepo.find({ where: { idea: { id: ideaId } } });
  }
}
