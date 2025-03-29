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

  // Register a new user
  async register(createUserDto: CreateUserDto) {
    // Check if the email already exists
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    // Return user without password (don't expose the hashed password)
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // Login a user and generate JWT
  async login(credentials: LoginDto) {
    const user = await this.usersService.findByEmail(credentials.email);
    //  const user = await this.usersService.findByEmail(credentials.email);
    console.log('User found:', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare the entered password with the stored hashed password
    const enteredPasswordTrimmed = credentials.password.trim();
    const storedPasswordTrimmed = user.password.trim();

    const isPasswordValid = await bcrypt.compare(
      enteredPasswordTrimmed,
      storedPasswordTrimmed,
    );

    console.log('Is password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token with user id and role
    const payload = { userId: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { access_token: accessToken };
  }
}
