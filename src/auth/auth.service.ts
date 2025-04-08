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

      // ✅ Debugging raw password
      console.log('Registration - Raw Password:', createUserDto.password);

      // ✅ Define saltRounds explicitly for consistency
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      // ✅ Debugging hashed password
      console.log('Registration - Hashed Password:', hashedPassword);

      // ✅ Create the new user with the hashed password
      const newUser = await this.usersService.createUser({
        ...createUserDto,
        password: hashedPassword,
      });

      // ✅ Debugging stored user object
      console.log('Registration - Stored User:', newUser);

      // Exclude the password from the returned user object
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      // ✅ Log any errors during registration for debugging
      console.error('Registration Error:', error);
      throw error; // Re-throw the error to be handled by your controller
    }
  }

  async login(credentials: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(credentials.email);

      // ✅ Debugging found user
      console.log('Login - User found:', user);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // ✅ Debugging passwords before comparison
      console.log('Login - Entered Password:', credentials.password);
      console.log('Login - Stored Hashed Password:', user.password);

      // ✅ Compare the entered password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.password,
      );

      // ✅ Debugging password match result
      console.log('Login - Password Match Result:', isPasswordValid);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // ✅ Generate JWT token with user ID and role
      const payload = { userId: user.id, role: user.role };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

      return { access_token: accessToken };
    } catch (error) {
      // ✅ Log any errors during login for debugging
      console.error('Login Error:', error);
      throw error; // Re-throw the error to be handled by your controller
    }
  }
}
