import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from './entities/ideas.entity';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>,
  ) {}

  async createIdea(ideaDto: any) {
    return this.ideaRepo.save({
      ...ideaDto,
      status: 'Pending',
    });
  }

  async getIdeaById(id: number) {
    const idea = await this.ideaRepo.findOne({
      where: { id },
    });
    if (!idea) throw new NotFoundException('Idea not found');
    return idea;
  }
}
