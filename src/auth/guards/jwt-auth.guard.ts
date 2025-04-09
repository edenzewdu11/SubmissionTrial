import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; // PassportStrategy from @nestjs/passport
import { ExtractJwt, Strategy } from 'passport-jwt'; // ExtractJwt from passport-jwt
import { JwtPayload } from '../interfaces/jwt-payload.interface'; // Your JwtPayload interface
import { UsersService } from '../../users/users.service'; // UsersService for user lookup
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      secretOrKey: 'mystrongsecretkey', // Use secret key to verify the JWT
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JwtAuthGuard - validate method called!');
    const user = await this.usersService.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    console.log('User from validate method:', user);

    return { id: user.id, role: user.role, email: user.email };
  }
}
