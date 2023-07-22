import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDTO } from './dto/createUserDTO';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthContoller {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() { user }) {
    const data = await this.authService.signin(user);
    return data;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDTO) {
    await this.authService.register(createUserDto);

    return { success: true };
  }
}
