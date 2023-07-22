import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDTO } from './dtos/createPostDto';
import { join } from 'path';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import writeImage from 'src/utils/writeImage';
import { prisma } from 'prisma/prismaClient';

@Injectable()
export class PostService {
  private async savePreviewCover(
    postTitle: string,
    preview: Express.Multer.File,
  ) {
    const previewDir = join(process.cwd(), 'images/postCovers', postTitle);
    if (!existsSync(previewDir)) {
      await mkdir(previewDir);
    }
    const ext = preview.mimetype.split('/');
    ext.shift();
    await writeImage(join(previewDir, `${postTitle}.${ext[0]}`), preview);
    return join('images/postCovers', postTitle, `${postTitle}.${ext[0]}`);
  }

  async createPost(
    createPostDto: CreatePostDTO,
    coverImg: Express.Multer.File,
  ) {
    let coverPath;
    const tmpUser = await prisma.user.findUnique({ where: { id: 1 } });
    try {
      coverPath = await this.savePreviewCover(
        createPostDto.title.replaceAll(' ', ''),
        coverImg,
      );
    } catch (error) {
      throw new InternalServerErrorException('error saving post images');
    }
    const res = await prisma.post.create({
      data: {
        title: createPostDto.title,
        shortDescription: createPostDto.description,
        previewImageCover: coverPath,
        postContent: {
          create: {
            content: createPostDto.content,
          },
        },
        author: {
          connect: { id: tmpUser.id },
        },
        categories: {
          create: createPostDto.tags.map((tagId) => ({
            category: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
      },
    });
  }

  async getPost(postId: number) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        postContent: { select: { content: true } },
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
    return post;
  }
}
