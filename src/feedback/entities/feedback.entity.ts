import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Idea } from '../../ideas/entities/ideas.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  comment: string;

  @ManyToOne(() => User, (admin) => admin.feedbacks)
  admin: User;

  @ManyToOne(() => Idea, (idea) => idea)
  idea: Idea;

  @Column({
    type: 'enum',
    enum: ['Reviewed', 'Approved', 'Rejected'],
    default: 'Reviewed',
  })
  status: string;
}
