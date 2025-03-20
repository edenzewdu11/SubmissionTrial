console.log('JWT Secret:', process.env.JWT_SECRET);

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
// import * as dotenv from 'dotenv';

// dotenv.config(); // Load environment variables

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'mystrongsecretkey', // ✅ Use secret from .env
      signOptions: { expiresIn: '1h' }, // Token expiry time
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
