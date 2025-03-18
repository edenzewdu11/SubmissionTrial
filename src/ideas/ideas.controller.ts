import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { IdeasService } from './ideas.service';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Post()
  async createIdea(@Body() ideaDto: any) {
    return this.ideasService.createIdea(ideaDto);
  }

  @Get(':id')
  async getIdea(@Param('id', ParseIntPipe) id: number) {
    return this.ideasService.getIdeaById(id);
  }
}
