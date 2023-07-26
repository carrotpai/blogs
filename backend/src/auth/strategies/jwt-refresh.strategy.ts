import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HashService } from 'src/hash/hash.service';
import { UserService } from 'src/user/user.service';
import { WRONG_REFRESH_TOKEN_MESSAGE } from 'src/utils/errorConstants';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    super({
      secretOrKey: configService.get('jwt.refreshSecret'),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { id: number }) {
    const user = await this.userService.getUserRefreshToken(payload.id);
    const refreshToken = request.headers['authorization'].split(' ')[1];
    const match = user.refreshToken === refreshToken;
    if (!match) {
      await this.authService.createAndUpdateRefreshToken(payload.id);
      throw new UnauthorizedException(WRONG_REFRESH_TOKEN_MESSAGE);
    }
    return { id: payload.id };
  }
}
