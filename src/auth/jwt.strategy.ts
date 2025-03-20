import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
      ignoreExpiration: false, // Ensure token expiration is enforced
      secretOrKey: 'mystrongsecretkey', // 🔒 Hardcoded secret key
    });
  }

  async validate(payload: any) {
    // Validate the JWT payload and return user details (customize as needed)
    return { userId: payload.sub, username: payload.username };
  }
}
