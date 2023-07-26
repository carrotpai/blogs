import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { UserService } from 'src/user/user.service';
import { WRONG_USERNAME_OR_PASSWORD_ERROR_MESSAGE } from 'src/utils/errorConstants';
import { CreateUserDTO } from './dto/createUserDTO';
import { ISigninTokens } from 'src/types/types';
import { prisma } from 'prisma/prismaClient';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashService: HashService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async validateUser(username: string, providedPassword: string) {
    const user = await this.userService.findOneByUsername(username);
    const match = await this.hashService.compare(
      providedPassword,
      user.password,
    );
    if (!match) {
      throw new UnauthorizedException(WRONG_USERNAME_OR_PASSWORD_ERROR_MESSAGE);
    }
    return { id: user.id, username: username };
  }

  async getUser(userId: number) {
    const user = await this.userService.findOneByIdOrFail(userId);
    delete user.password;
    delete user.refreshToken;
    return user;
  }

  async createAndUpdateRefreshToken(userId: number) {
    const token = await this.issueRefreshToken(userId);
    await this.userService.updateUserRefreshToken(userId, token);
  }

  async refresh(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.issueAccessToken(userId),
      this.issueRefreshToken(userId),
    ]);
    await this.userService.updateUserRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  async signin(userId: number): Promise<ISigninTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.issueAccessToken(userId),
      this.issueRefreshToken(userId),
    ]);
    await this.userService.updateUserRefreshToken(userId, refreshToken);
    const user = await this.userService.findOneByIdOrFail(userId);
    delete user.password;
    delete user.refreshToken;
    return { user, accessToken, refreshToken };
  }

  async register(createUserDto: CreateUserDTO) {
    await this.userService.create(
      createUserDto.username,
      createUserDto.password,
    );
  }

  private async issueAccessToken(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: '1h',
    });
    return accessToken;
  }

  private async issueRefreshToken(userId: number) {
    const payload = { id: userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: '1d',
    });
    return refreshToken;
  }
}
