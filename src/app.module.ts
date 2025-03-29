import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FeedbackModule } from './feedback/feedback.module';
import { IdeasModule } from './ideas/ideas.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Feedback } from './feedback/entities/feedback.entity';
import { Idea } from './ideas/entities/ideas.entity';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entities/profile.entity';
import { profile } from 'console';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'dere2010',
      database: 'Think-Tank',
      synchronize: true,
      entities: [User, Feedback, Idea, Profile],
      autoLoadEntities: true,
    }),

    TypeOrmModule.forFeature([User, Feedback, Idea, Profile]), // Import the entities here

    AuthModule,
    UsersModule,
    FeedbackModule,
    IdeasModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
