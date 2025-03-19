import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity'; // Import Profile entity

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]), // Add Profile entity here
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
