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
  Patch,
} from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {} // ✅ fixed here

  // Create Idea - Only 'user' role allowed
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async createIdea(@Body() createIdeaDto: CreateIdeaDto, @Request() req) {
    const userId = req.user.id;
    return this.ideasService.createIdea(createIdeaDto, userId);
  }

  // Get Idea by ID
  @Get(':id')
  async getIdea(@Param('id', ParseIntPipe) id: number) {
    return this.ideasService.getIdeaById(id); // ✅ fixed here
  }

  @Get('/public')
  async getPublicIdeas() {
    return this.ideasService.getApprovedIdeas();
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approveIdea(@Param('id', ParseIntPipe) id: number) {
    return this.ideasService.approveIdea(id);
  }
}
