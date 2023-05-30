import { Controller, Post, Body, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/get-headers.decorator';
import { Auth } from './decorators/auth.decorator';

import { User } from './entities/auth.entity';

import { ValidRoles } from './interfaces/valid-roles';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.create(createUserDto);
  }

  @Post('signin')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<any> {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User): Object {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @Auth(ValidRoles.user)
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ): Object {
    return {
      ok: true,
      user,
      userEmail,
      rawHeaders
    };
  }

  @Get('private2')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  testingPrivateRoute2(
    @GetUser() user: User,
  ): Object {
    return {
      ok: true,
      user,
    };
  }

}
