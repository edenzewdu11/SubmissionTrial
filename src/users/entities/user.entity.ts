import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
} from 'typeorm';
import { Idea } from '../../ideas/entities/ideas.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import * as bcrypt from 'bcryptjs';
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

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  @OneToMany(() => Idea, (idea) => idea.user)
  ideas: Idea[];

  @OneToMany(() => Feedback, (feedback) => feedback.admin)
  feedbacks: Feedback[];

  @OneToOne(() => Profile, (profile) => profile.user) // Add this line for the inverse relationship
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date; // Fixed the inconsistency

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Hook to hash password before saving to DB
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
