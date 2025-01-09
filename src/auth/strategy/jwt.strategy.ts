import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    authService: AuthService,
    @InjectModel('User')
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authService.getJwtSecret(),
    });
  }

  //token is transfromed into an object and put into a payload
  async validate(payload) {
    const { sub } = payload;
    try {
      return await this.userModel.findById(sub);
    } catch (e: unknown) {
      throw new UnauthorizedException();
    }
    //payload is appended to the @Req object in controller to route which is protected by guard
    // HERE
    // @Controller('users')
    // export class UserController {
    //   constructor(private readonly userService: UserService) {}
    //
    //   @UseGuards(JwtAuthGuard)
    //   @Get('me')
    //   getMe(@Req() req) {
    //     console.log(req.user);
    //     return this.userService.getMe();
    //   }
    // }
  }
}
