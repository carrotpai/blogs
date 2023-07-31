import { Injectable } from '@nestjs/common';
import { prisma } from 'prisma/prismaClient';
import { CreateCommentDTO } from './dtos/createCommentDTO';

@Injectable()
export class CommentService {
  private pageSize = 2;
  async getNotNestedComments(postId: number, page: number) {
    const [comments, totalComments] = await prisma.$transaction([
      prisma.comment.findMany({
        skip: this.pageSize * (page - 1),
        take: this.pageSize,
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
    return [comments, totalComments, page + 1];
  }

  async getNestedComments(commentId: number, page: number) {
    const [comments, totalComments] = await prisma.$transaction([
      prisma.comment.findMany({
        skip: this.pageSize * (page - 1),
        take: this.pageSize,
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
    return [comments, totalComments, page + 1];
  }

  async createNotNestedComment(
    postId: number,
    userId: number,
    createCommentDTO: CreateCommentDTO,
  ) {
    const res = await prisma.comment.create({
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
    return { commentId: res.id };
  }

  async createNestedComment(
    parentCommentId: number,
    postId: number,
    userId: number,
    createCommentDTO: CreateCommentDTO,
  ) {
    const res = await prisma.comment.create({
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
    return { commentId: res.id };
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

  async getNestedCommentsForUser(
    userId: number,
    commentId: number,
    page: number,
  ) {
    const [userComments, restComments, count] = await prisma.$transaction([
      prisma.comment.findMany({
        where: { authorId: userId, parentComment: { id: commentId } },
        orderBy: {
          createdAt: 'desc',
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
      prisma.comment.findMany({
        where: { authorId: { not: userId }, parentComment: { id: commentId } },
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
    const skip = this.pageSize * (page - 1);
    const data = userComments
      .concat(restComments)
      .slice(skip, skip + this.pageSize);
    return [[...data], count, page + 1];
  }

  async getRootCommentsForUser(userId: number, postId: number, page: number) {
    const [userComments, restComments, count] = await prisma.$transaction([
      prisma.comment.findMany({
        where: {
          authorId: userId,
          postId: postId,
          parentCommentId: null,
        },
        orderBy: {
          createdAt: 'desc',
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
      prisma.comment.findMany({
        where: {
          authorId: { not: userId },
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
    const skip = this.pageSize * (page - 1);
    const data = userComments
      .concat(restComments)
      .slice(skip, skip + this.pageSize);
    return [[...data], count, page + 1];
  }
}
