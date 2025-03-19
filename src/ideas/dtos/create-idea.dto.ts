import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  tags?: string;
}
