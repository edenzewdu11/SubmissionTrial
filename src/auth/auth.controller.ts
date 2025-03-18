import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: any) {
    return this.authService.register(userDto);
  }

  @Post('login')
  async login(@Body() credentials: any) {
    return this.authService.login(credentials);
  }
}
