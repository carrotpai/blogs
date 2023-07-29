import { Injectable } from '@nestjs/common';
import { prisma } from 'prisma/prismaClient';
import { CreateCommentDTO } from './dtos/createCommentDTO';

@Injectable()
export class CommentService {
  async getNotNestedComments(postId: number) {
    const [comments, totalComments] = await prisma.$transaction([
      prisma.comment.findMany({
        where: {
          postId: postId,
          parentCommentId: null,
        },
        include: {
          user: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
        },
      }),
      prisma.comment.count({
        where: {
          postId: postId,
          parentCommentId: null,
        },
      }),
    ]);
    return [comments, totalComments];
  }

  async getNestedComments(commentId: number) {
    const [comments, totalComments] = await prisma.$transaction([
      prisma.comment.findMany({
        where: {
          parentComment: { id: commentId },
        },
        include: {
          user: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
        },
      }),
      prisma.comment.count({
        where: {
          parentComment: { id: commentId },
        },
      }),
    ]);
    return [comments, totalComments];
  }

  async createNotNestedComment(
    postId: number,
    userId: number,
    createCommentDTO: CreateCommentDTO,
  ) {
    await prisma.comment.create({
      data: {
        text: createCommentDTO.text,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return 'created';
  }

  async createNestedComment(
    parentCommentId: number,
    postId: number,
    userId: number,
    createCommentDTO: CreateCommentDTO,
  ) {
    await prisma.comment.create({
      data: {
        text: createCommentDTO.text,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
        parentComment: { connect: { id: parentCommentId } },
      },
    });
    return 'created';
  }

  async getCountForRootComments(postId: number) {
    return await prisma.comment.count({
      where: { postId: postId, parentCommentId: null },
    });
  }

  async getCountForNestedComments(commentId: number) {
    return await prisma.comment.count({
      where: {
        parentComment: { id: commentId },
      },
    });
  }

  async getCountForAllCommentsForPost(postId: number) {
    return await prisma.comment.count({
      where: {
        postId: postId,
      },
    });
  }
}
