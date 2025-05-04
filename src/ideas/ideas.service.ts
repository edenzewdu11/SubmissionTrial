import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

// ... existing code ...
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from './entities/ideas.entity';
import { User } from '../users/entities/user.entity';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { IdeaStatus } from './entities/ideas.entity';
import { UpdateIdeaDto } from './dtos/update-idea.dto';

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

  async getUserIdeas(userId: number): Promise<Idea[]> {
    return this.ideaRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
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

  async deleteIdea(
    id: number,
    userId: number,
    userRole: string,
  ): Promise<void> {
    const idea = await this.ideaRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!idea) throw new NotFoundException('Idea not found');

    // Check if user is admin or the owner of the idea
    if (userRole !== 'admin' && idea.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own ideas');
    }

    await this.ideaRepo.remove(idea);
  }
  // backend/src/ideas/ideas.service.ts
  async updateIdea(
    id: number,
    userId: number,
    updateIdeaDto: UpdateIdeaDto,
  ): Promise<Idea> {
    const idea = await this.ideaRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!idea) {
      throw new NotFoundException('Idea not found');
    }

    // Check if user is the owner of the idea
    if (idea.user.id !== userId) {
      throw new ForbiddenException('You can only update your own ideas');
    }

    // Update the idea fields
    idea.title = updateIdeaDto.title;
    idea.description = updateIdeaDto.description;

    idea.updatedAt = new Date();

    return this.ideaRepo.save(idea);
  }
}
