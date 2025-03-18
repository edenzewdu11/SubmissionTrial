import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FeedbackModule } from './feedback/feedback.module';
import { IdeasModule } from './ideas/ideas.module';

@Module({
  imports: [AuthModule, UsersModule, FeedbackModule, IdeasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
