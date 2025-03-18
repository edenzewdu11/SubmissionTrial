import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Idea } from '../../ideas/entities/ideas.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  @OneToMany(() => Idea, (idea) => idea.user)
  ideas: Idea[];

  @OneToMany(() => Feedback, (feedback) => feedback.admin)
  feedbacks: Feedback[];
}
