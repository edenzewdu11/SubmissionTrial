import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersService.findByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      const newUser = await this.usersService.createUser({
        ...createUserDto,
        password: hashedPassword,
      });

      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }

  async login(credentials: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(credentials.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // ✅ Include sub, username, and role in JWT payload
      const payload = {
        sub: user.id,
        email: user.email, // or user.email if username is not used
        role: user.role,
      };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

      return { access_token: accessToken };
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }
}
