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
    // Check if the email already exists
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    // Return user without password (don't return the password hash)
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(credentials: LoginDto) {
    const user = await this.usersService.findByEmail(credentials.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // Return JWT with user info
    const payload = { userId: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }
}
