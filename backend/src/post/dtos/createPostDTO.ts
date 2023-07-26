import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsJSON } from 'class-validator';

export class CreatePostDTO {
  title: string;
  description: string;

  @Transform(({ value }) => {
    /* console.log(value.value); */
    if (!value) throw new BadRequestException('Unexpected json array of tags');
    return JSON.parse(value);
  })
  tags: number[];

  content: string;
  cover: string;
}
