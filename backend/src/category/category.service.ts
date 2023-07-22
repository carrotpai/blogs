import { Injectable } from '@nestjs/common';
import { prisma } from 'prisma/prismaClient';

@Injectable()
export class CategoryService {
  async getCategories() {
    const res = await prisma.category.findMany();
    return res;
  }
}
