import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import JwtAuthGuard
import { RolesGuard } from '../auth/guards/roles.guard'; // Import custom RolesGuard
import { Roles } from '../auth/decorators/roles.decorator'; // Import Roles decorator

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  // Create Idea - Only 'user' role allowed
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Protect the route with JWT and role-based guard
  @Roles('user') // Only 'user' role can create ideas
  async createIdea(@Body() createIdeaDto: CreateIdeaDto, @Request() req) {
    const userId = req.user.id; // Access the user ID from the JWT payload
    return this.ideasService.createIdea(createIdeaDto, userId); // Pass the userId when creating an idea
  }

  // Get Idea by ID - Everyone can view ideas
  @Get(':id')
  async getIdea(@Param('id', ParseIntPipe) id: number) {
    return this.ideasService.getIdeaById(id);
  }
}
