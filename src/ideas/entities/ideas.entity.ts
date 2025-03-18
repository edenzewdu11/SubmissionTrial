import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @Column({
    type: 'enum',
    enum: ['Pending', 'Reviewed', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  status: string;
}
