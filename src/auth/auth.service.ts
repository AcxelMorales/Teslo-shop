import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync, compareSync } from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { User } from './entities/auth.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return user;
  }

  private handleDbErrors(error: any): never {
    if (error.code == '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

}
