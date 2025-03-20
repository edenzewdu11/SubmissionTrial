import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto'; // Assuming you have this DTO for registration
import { LoginDto } from './dtos/login.dto'; // Assuming you have this DTO for login

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // Pass the DTO to the register method of the service
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Pass the DTO to the login method of the service
    return this.authService.login(loginDto);
  }
}
