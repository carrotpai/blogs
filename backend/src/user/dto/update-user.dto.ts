import { Length, IsString, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @Length(4, 250)
  @IsOptional()
  username?: string;

  @IsString()
  @Length(4, 250)
  @IsOptional()
  info?: string;

  @IsString()
  @Length(4, 250)
  @IsOptional()
  description?: string;

  @IsString()
  @Length(8, 200)
  @IsOptional()
  password?: string;

  @IsString()
  @Length(8, 200)
  @IsOptional()
  newPassword?: string;
}
