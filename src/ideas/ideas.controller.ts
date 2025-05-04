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
  Delete,
} from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dtos/create-idea.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport'; // Make sure this import exists
import { UpdateIdeaDto } from './dtos/update-idea.dto';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  // Create Idea - Only 'user' role allowed
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user')
  async createIdea(@Body() createIdeaDto: CreateIdeaDto, @Request() req) {
    const userId = req.user.id; // Extract userId from request
    return this.ideasService.createIdea(createIdeaDto, userId);
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserIdeas(@Request() req) {
    const userId = req.user.id;
    return this.ideasService.getUserIdeas(userId);
  }

  // Get all public (approved) ideas
  @Get('/public')
  async getPublicIdeas() {
    return this.ideasService.getApprovedIdeas();
  }
  // Get Idea by ID
  @Get(':id')
  async getIdea(@Param('id', ParseIntPipe) id: number) {
    return this.ideasService.getIdeaById(id);
  }

  // Approve Idea - Only 'admin' role allowed
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approveIdea(@Param('id', ParseIntPipe) id: number) {
    return this.ideasService.approveIdea(id);
  }
  // backend/src/ideas/ideas.controller.ts
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateIdea(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateIdeaDto: UpdateIdeaDto,
  ) {
    const userId = req.user.id;
    return this.ideasService.updateIdea(id, userId, updateIdeaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('user', 'admin')
  async deleteIdea(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.ideasService.deleteIdea(id, userId, userRole);
  }
}
