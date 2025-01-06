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

  async signin(body: SignInDto): Promise<{ token: string }> {
    const { login } = body;
    const user = await this.userModel.findOne({
      $or: [{ login: login }, { email: login }],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { password } = body;
    const arePasswordsMatches = await verify(user.password, password);

    if (user && arePasswordsMatches) {
      const payload = { sub: user._id, login: login };
      return {
        token: await this.jwtService.signAsync(payload),
      };
    }

    throw new UnauthorizedException();
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
      const { password, ...rest } = newUser;
      return rest;
    } catch (error) {
      if (error instanceof MongooseError) {
        console.log(error.message);
        throw new Error(error.message);
      }
      throw new Error(error);
    }
  }
}
