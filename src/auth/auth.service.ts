import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { hash } from 'argon2';
import { Model, MongooseError } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  async signin(body: SignInDto): Promise<any> {
    const { login, password } = body;
    const user = await this.userModel.findOne({
      $or: [{ login: login }, { email: login }],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { _id } = user;
    const sub = _id.toString();

    const arePasswordsMatches = await verify(user.password, password);

    if (user && arePasswordsMatches) {
      return this.signToken(sub, user.login);
    }

    throw new UnauthorizedException();
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, username: email };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return { access_token };
  }

  async signup(body: SignUpDto) {
    const { password } = body;
    const hashedPassword = await hash(password);
    try {
      const newUser = await this.userModel.create({
        ...body,
        password: hashedPassword,
      });
      await newUser.save();
      const sub = newUser._id.toString();
      return this.signToken(sub, newUser.login);
    } catch (error) {
      if (error instanceof MongooseError) {
        console.log(error.message);
        throw new Error(error.message);
      }
      throw new Error(error);
    }
  }
}
