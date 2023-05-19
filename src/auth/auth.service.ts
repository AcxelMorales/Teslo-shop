import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { hashSync, compareSync } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { User } from './entities/auth.entity';

import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({
          id: user.id,
        }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    delete user.password;

    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
      }),
    };
  }

  checkAuthStatus(user: User): Object {
    return {
      ...user,
      token: this.getJwtToken({
        id: user.id,
      }),
    };
  }

  private getJwtToken(payload: JwtPayload): string {
    const token: string = this.jwtService.sign(payload);
    return token;
  }

  private handleDbErrors(error: any): never {
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

}
