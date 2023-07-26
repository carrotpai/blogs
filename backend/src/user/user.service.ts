import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import writeImage from 'src/utils/writeImage';
import { prisma } from 'prisma/prismaClient';
import {
  USER_NOT_FOUND_ERROR_MESSAGE,
  WRONG_REFRESH_TOKEN_MESSAGE,
  WRONG_USERNAME_OR_PASSWORD_ERROR_MESSAGE,
} from 'src/utils/errorConstants';
import { HashService } from 'src/hash/hash.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly hashService: HashService) {}

  private async saveAvatar(username: string, avatar: Express.Multer.File) {
    const avatarDir = join(process.cwd(), 'images/avatar', username);
    if (!existsSync(avatarDir)) {
      await mkdir(avatarDir);
    }
    const ext = avatar.mimetype.split('/');
    ext.shift();
    await writeImage(join(avatarDir, `${username}.${ext[0]}`), avatar);
    return join('images', 'avatar', username, `${username}.${ext[0]}`);
  }

  async create(username: string, password: string) {
    const hashPassword = await this.hashService.create(password);
    await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
      },
    });
  }

  async update(
    updateUserDto: UpdateUserDTO,
    userId: number,
    avatar?: Express.Multer.File,
  ) {
    let updateData = {
      ...updateUserDto,
    };

    let dir;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (avatar) {
      dir = await this.saveAvatar(user.username, avatar);
    }
    if (dir) {
      updateData['avatar'] = dir;
    }
    if (updateUserDto?.newPassword) {
      const isValid = await this.hashService.compare(
        updateUserDto.password,
        user.password,
      );
      if (!isValid) {
        throw new UnauthorizedException('Wrong password');
      }
      const hash = await this.hashService.create(updateUserDto.newPassword);
      updateData.password = hash;
    }
    //удаляем ненужное поле для таблицы БД
    delete updateData.newPassword;
    console.log(updateData);
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneByIdOrFail(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException(USER_NOT_FOUND_ERROR_MESSAGE);
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        password: true,
        role: true,
      },
      where: { username: username },
    });
    if (!user)
      throw new UnauthorizedException(WRONG_USERNAME_OR_PASSWORD_ERROR_MESSAGE);
    return user;
  }

  async getUserRefreshToken(userId: number) {
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        refreshToken: true,
      },
      where: { id: userId },
    });
    if (!user) throw new UnauthorizedException(WRONG_REFRESH_TOKEN_MESSAGE);
    return user;
  }

  async updateUserRefreshToken(userId: number, refreshToken: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: refreshToken,
      },
    });
    return;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
