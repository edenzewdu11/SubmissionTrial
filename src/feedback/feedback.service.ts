import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { IdeasService } from '../ideas/ideas.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepo: Repository<Feedback>,
    private readonly ideasService: IdeasService,
  ) {}

  async createFeedback(feedbackDto: any) {
    const idea = await this.ideasService.getIdeaById(feedbackDto.ideaId);
    if (!idea) throw new NotFoundException('Idea not found');

    return this.feedbackRepo.save({
      ...feedbackDto,
      status: feedbackDto.status || 'Reviewed',
    });
  }

  async getFeedbackByIdeaId(ideaId: number) {
    return this.feedbackRepo.find({ where: { idea: { id: ideaId } } });
  }
}
