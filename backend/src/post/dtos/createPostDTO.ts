import { Transform, Type } from 'class-transformer';

export class CreatePostDTO {
  title: string;
  description: string;

  @Transform(({ value }) => JSON.parse(value))
  tags: number[];
  content: string;
}
