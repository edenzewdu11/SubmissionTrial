import { IsString, IsOptional, IsEnum } from 'class-validator';
import { FeedbackStatus } from '../entities/feedback.entity'; // Assuming you have this enum

export class UpdateFeedbackDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsEnum(FeedbackStatus)
  status?: FeedbackStatus;

  // You might choose whether or not to allow updating ideaId
  // @IsOptional()
  // @IsInt()
  // ideaId?: number;

  // Updating the admin association is generally not recommended
}
