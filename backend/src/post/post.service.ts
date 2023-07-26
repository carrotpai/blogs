import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePostDTO } from './dtos/createPostDto';
import { join } from 'path';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import writeImage from 'src/utils/writeImage';
import { prisma } from 'prisma/prismaClient';

interface RatingChangeObject {
  increment?: number;
  decrement?: number;
}

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
    return join('images', 'postCovers', postTitle, `${postTitle}.${ext[0]}`);
  }

  async createPost(
    createPostDto: CreatePostDTO,
    userId: number,
    coverImg: Express.Multer.File,
  ) {
    console.log(createPostDto);
    let coverPath;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    try {
      if (coverImg) {
        coverPath = await this.savePreviewCover(
          createPostDto.title.replaceAll(' ', ''),
          coverImg,
        );
      }
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
          connect: { id: user.id },
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
        userLikedPosts: { create: { userId: userId } },
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
            avatar: true,
          },
        },
        postContent: { select: { content: true } },
        categories: {
          select: {
            category: true,
          },
        },
        userLikedPosts: {
          select: {
            status: true,
          },
        },
      },
    });
    let status = 0;
    if (post) {
      status = post.userLikedPosts[0].status;
    }
    const res = { ...post, status };
    delete res.userLikedPosts;
    return res;
  }

  async upvote(userId: number, postId: number) {
    const postStatusForUser = await prisma.userLikedPosts.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    let newRating: RatingChangeObject = {
      increment: 1,
    };
    let isAlreadyVoted = false;
    if (postStatusForUser) {
      if (postStatusForUser.status > 0) {
        newRating = { decrement: 1 };
        isAlreadyVoted = true;
      }
      if (postStatusForUser.status < 0) {
        newRating = { increment: 2 };
      }
    }
    console.log('in upvote');
    await prisma.post.update({
      where: { id: postId },
      data: {
        rating: newRating,
        userLikedPosts: {
          upsert: {
            where: {
              userId_postId: { userId, postId },
            },
            update: {
              status: isAlreadyVoted ? 0 : 1,
            },
            create: {
              userId: userId,
              status: 1,
            },
          },
        },
      },
    });
  }

  async downvote(userId: number, postId: number) {
    const postStatusForUser = await prisma.userLikedPosts.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    let newRating: RatingChangeObject = { decrement: 1 };
    let isAlreadyVoted: boolean = false;
    if (postStatusForUser) {
      if (postStatusForUser.status < 0) {
        isAlreadyVoted = true;
        newRating = { increment: 1 };
      }
      if (postStatusForUser.status > 0) {
        newRating = { decrement: 2 };
      }
    }
    await prisma.post.update({
      where: { id: postId },
      data: {
        rating: newRating,
        userLikedPosts: {
          upsert: {
            where: {
              userId_postId: { userId, postId },
            },
            update: {
              status: isAlreadyVoted ? 0 : -1,
            },
            create: {
              userId: userId,
              status: -1,
            },
          },
        },
      },
    });
  }
}
