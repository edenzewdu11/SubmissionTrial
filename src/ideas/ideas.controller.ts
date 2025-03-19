import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dtos/create-idea.dto';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  // Using CreateIdeaDto for proper validation and type safety
  @Post()
  async createIdea(@Body() createIdeaDto: CreateIdeaDto) {
    return this.ideasService.createIdea(createIdeaDto); // Pass the DTO to the service
  }

  @Get(':id')
  async getIdea(@Param('id', ParseIntPipe) id: number) {
    return this.ideasService.getIdeaById(id);
  }
}
