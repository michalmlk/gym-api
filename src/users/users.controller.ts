import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../auth/decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  getMe(@User() user) {
    //validate appends user property to the request object
    return { user }; //user property is that what is passed as payload to the validate function in .strategy.ts
  }
}
