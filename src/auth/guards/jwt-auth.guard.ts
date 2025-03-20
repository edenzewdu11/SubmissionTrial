import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; // Use PassportStrategy from @nestjs/passport
import { ExtractJwt, Strategy } from 'passport-jwt'; // Import Strategy from passport-jwt directly
import { JwtPayload } from '../interfaces/jwt-payload.interface'; // Import your JwtPayload interface
import { UsersService } from '../../users/users.service'; // Import UsersService
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy) {
  // Use PassportStrategy and pass Strategy from passport-jwt
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      secretOrKey: 'mystrongsecretkey', // Use secret key to verify the JWT
    });
  }

  async validate(payload: JwtPayload) {
    // Use the payload to find the user
    const user = await this.usersService.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    return user; // Attach user to the request (req.user)
  }
}
