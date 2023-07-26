import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDTO } from './dto/createUserDTO';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RequestWithUser } from 'src/types/types';

@Controller('auth')
export class AuthContoller {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('getAuthData')
  async getUser(@Request() { user }: RequestWithUser) {
    return this.authService.getUser(user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Request() { user }: RequestWithUser) {
    return this.authService.refresh(user.id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() { user }: RequestWithUser) {
    const data = await this.authService.signin(user.id);
    return data;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDTO) {
    await this.authService.register(createUserDto);

    return { success: true };
  }
}
