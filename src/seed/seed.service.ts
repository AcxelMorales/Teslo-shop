import { Injectable } from '@nestjs/common';

import { ProductsService } from 'src/products/products.service';

import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(private readonly productsService: ProductsService) { }

  async runSeed(): Promise<string> {
    await this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts(): Promise<boolean> {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;
    const insertPromise = [];

    // products.forEach((product) => {
    //   const promise = this.productsService.create(product);
    //   insertPromise.push(promise);
    // });

    await Promise.all(insertPromise);

    return true;
  }

}
