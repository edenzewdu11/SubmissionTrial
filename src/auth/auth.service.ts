import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UsersModule } from 'src/users/users.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    return this.usersService.createUser({
      ...userDto,
      password: hashedPassword,
    });
  }

  async login(credentials: any) {
    const user = await this.usersService.findByEmail(credentials.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return {
      access_token: this.jwtService.sign({ userId: user.id, role: user.role }),
    };
  }
}
