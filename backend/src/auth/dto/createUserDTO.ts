import { IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(4, 50)
  username: string;

  @IsString()
  @Length(8, 50)
  password: string;
}
