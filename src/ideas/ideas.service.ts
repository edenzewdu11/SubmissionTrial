import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from './entities/ideas.entity';
import { User } from '../users/entities/user.entity'; // Import the User entity
import { CreateIdeaDto } from './dtos/create-idea.dto';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea) private readonly ideaRepo: Repository<Idea>, // Inject Idea repository
    @InjectRepository(User) private readonly userRepo: Repository<User>, // Inject User repository
  ) {}

  async createIdea(
    createIdeaDto: CreateIdeaDto,
    userId: number,
  ): Promise<Idea> {
    // Fetch the user to associate the idea with the user
    const user = await this.userRepo.findOne({
      where: { id: userId }, // Use the `where` clause to specify the condition
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Create a new Idea instance
    const idea = this.ideaRepo.create(createIdeaDto);

    // Associate the idea with the user
    idea.user = user;

    // Save the new idea to the database
    return this.ideaRepo.save(idea);
  }

  async getIdeaById(id: number): Promise<Idea> {
    const idea = await this.ideaRepo.findOne({
      where: { id },
    });
    if (!idea) throw new NotFoundException('Idea not found');
    return idea;
  }
}
