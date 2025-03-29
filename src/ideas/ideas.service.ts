import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from './entities/ideas.entity';
import { User } from '../users/entities/user.entity';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { IdeaStatus } from './entities/ideas.entity';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createIdea(
    createIdeaDto: CreateIdeaDto,
    userId: number,
  ): Promise<Idea> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const idea = this.ideaRepo.create(createIdeaDto);
    idea.user = user;
    idea.status = IdeaStatus.Pending; // ✅ Set default status

    return this.ideaRepo.save(idea);
  }

  async getIdeaById(id: number): Promise<Idea> {
    const idea = await this.ideaRepo.findOne({ where: { id } });
    if (!idea) throw new NotFoundException('Idea not found');
    return idea;
  }

  async getApprovedIdeas(): Promise<Idea[]> {
    return this.ideaRepo.find({
      where: { status: IdeaStatus.Approved },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async approveIdea(id: number): Promise<Idea> {
    const idea = await this.ideaRepo.findOne({ where: { id } });
    if (!idea) throw new NotFoundException('Idea not found');
    idea.status = IdeaStatus.Approved;
    return this.ideaRepo.save(idea);
  }
}
