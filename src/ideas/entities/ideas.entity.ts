import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';

export enum IdeaStatus {
  Pending = 'Pending',
  Reviewed = 'Reviewed',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

@Entity()
export class Idea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => User, (user) => user.ideas)
  user: User;

  @OneToMany(() => Feedback, (feedback) => feedback.idea)
  feedback: Feedback[];

  @Column({
    type: 'enum',
    enum: IdeaStatus,
    default: IdeaStatus.Pending,
  })
  status: IdeaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}