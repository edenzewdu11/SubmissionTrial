import { IsString, IsOptional, IsArray, MinLength } from 'class-validator';

export class UpdateIdeaDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
