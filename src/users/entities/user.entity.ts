import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { Idea } from '../../ideas/entities/ideas.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Profile } from 'src/profile/entities/profile.entity';

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

  @Column('text')
  password: string; // Store the already hashed password here

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role?: string;

  @OneToMany(() => Idea, (idea) => idea.user)
  ideas: Idea[];

  @OneToMany(() => Feedback, (feedback) => feedback.admin)
  feedbacks: Feedback[];

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
