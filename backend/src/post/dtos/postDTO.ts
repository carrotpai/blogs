import { Transform, Type } from 'class-transformer';

export class PostDTO {
  title: string;
  description: string;
  tags: number[];
  content: string;
}
