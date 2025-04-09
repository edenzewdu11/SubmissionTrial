import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateIdeaDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  tags?: string;
}
