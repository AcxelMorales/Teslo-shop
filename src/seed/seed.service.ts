import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync } from 'bcrypt';

import { ProductsService } from 'src/products/products.service';

import { User } from '../auth/entities/auth.entity';

import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async runSeed(): Promise<string> {
    await this.deleteTables();
    const firstUser = await this.insertUsers();
    await this.insertNewProducts(firstUser);
    return 'SEED EXECUTED';
  }

  private async insertUsers(): Promise<User> {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      user.password = hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });

    await this.userRepository.save(users);
    return users[0];
  }

  private async deleteTables(): Promise<void> {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute()
  }

  private async insertNewProducts(user: User): Promise<boolean> {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromise = [];

    products.forEach((product) => {
      const promise = this.productsService.create(product, user);
      insertPromise.push(promise);
    });

    await Promise.all(insertPromise);

    return true;
  }

}
