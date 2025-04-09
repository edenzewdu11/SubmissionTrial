import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Idea } from '../../ideas/entities/ideas.entity';

export enum FeedbackStatus {
  Reviewed = 'Reviewed',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn() // <----- THIS LINE WAS MISSING IN YOUR LAST SNIPPET
  id: number;

  @Column('text')
  comment: string;

  @ManyToOne(() => User, (admin) => admin.feedbacks)
  admin: User;

  @ManyToOne(() => Idea, (idea) => idea)
  idea: Idea;

  @Column({
    type: 'enum',
    enum: FeedbackStatus,
    default: FeedbackStatus.Reviewed,
  })
  status: FeedbackStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
