import { Injectable } from '@nestjs/common';
import { prisma } from 'prisma/prismaClient';

interface RatingChangeObject {
  increment?: number;
  decrement?: number;
}

@Injectable()
export class CommentVoteService {
  async upvote(userId: number, commentId: number) {
    const commentStatusForUser = await prisma.userLikedComments.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
    let newRating: RatingChangeObject = {
      increment: 1,
    };
    let isAlreadyVoted = false;
    if (commentStatusForUser) {
      if (commentStatusForUser.status > 0) {
        newRating = { decrement: 1 };
        isAlreadyVoted = true;
      }
      if (commentStatusForUser.status < 0) {
        newRating = { increment: 2 };
      }
    }
    console.log('in upvote');
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        rating: newRating,
        userLikedComments: {
          upsert: {
            where: {
              userId_commentId: { userId, commentId },
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

  async downvote(userId: number, commentId: number) {
    const commentStatusForUser = await prisma.userLikedComments.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
    let newRating: RatingChangeObject = { decrement: 1 };
    let isAlreadyVoted: boolean = false;
    if (commentStatusForUser) {
      if (commentStatusForUser.status < 0) {
        isAlreadyVoted = true;
        newRating = { increment: 1 };
      }
      if (commentStatusForUser.status > 0) {
        newRating = { decrement: 2 };
      }
    }
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        rating: newRating,
        userLikedComments: {
          upsert: {
            where: {
              userId_commentId: { userId, commentId },
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
