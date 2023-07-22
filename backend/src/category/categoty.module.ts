import { Module } from '@nestjs/common';
import { CategoryController } from './categoty.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
