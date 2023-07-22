import { Length, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @Length(4, 250)
  username: string;

  @IsString()
  @Length(4, 250)
  info: string;

  @IsString()
  @Length(4, 250)
  description: string;

  @IsString()
  @Length(8, 200)
  password: string;

  @IsString()
  @Length(8, 200)
  newPassword: string;
}
