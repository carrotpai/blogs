import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateCommentDTO {
  @IsDefined()
  @IsString()
  text: string;
}
