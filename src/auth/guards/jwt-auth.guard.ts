import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'; // Use PassportStrategy from @nestjs/passport
import { ExtractJwt, Strategy } from 'passport-jwt'; // Import Strategy from passport-jwt directly
import { JwtPayload } from '../interfaces/jwt-payload.interface'; // Import your JwtPayload interface
import { UsersService } from '../../users/users.service'; // Import UsersService
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      secretOrKey: 'mystrongsecretkey', // Use secret key to verify the JWT
    });
  }

  // This method validates the JWT token and attaches the user to the request
  async validate(payload: JwtPayload) {
    // Use the payload to find the user by the ID
    const user = await this.usersService.getUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    // The user is returned here, and it will automatically be attached to req.user
    return user;
  }
}
