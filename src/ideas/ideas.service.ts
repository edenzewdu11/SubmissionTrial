import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from './entities/ideas.entity';
import { CreateIdeaDto } from './dtos/create-idea.dto';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>,
  ) {}

  async createIdea(createIdeaDto: CreateIdeaDto): Promise<Idea> {
    return this.ideaRepo.save({
      ...createIdeaDto,
      status: 'Pending',
    });
  }

  async getIdeaById(id: number): Promise<Idea> {
    const idea = await this.ideaRepo.findOne({
      where: { id },
    });
    if (!idea) throw new NotFoundException('Idea not found');
    return idea;
  }
}
