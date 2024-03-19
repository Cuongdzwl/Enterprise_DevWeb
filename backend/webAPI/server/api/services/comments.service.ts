import { Comment } from './../../models/Comment';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { ExceptionMessage } from '../common/exception';

const prisma = new PrismaClient();
const model = 'comments';

export class CommentsService implements ISuperService<Comment> {
  all(): Promise<any> {
    const comments = prisma.comments.findMany();
    L.info(comments, `fetch all ${model}(s)`);
    return Promise.resolve(comments);
  }

  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const comment = prisma.comments.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(comment);
  }

  filter(filter: string, key: string): Promise<any> {
    L.info(`fetch ${model}(s) with filter`, filter);
    const comments = prisma.comments.findMany({
      where: {
        [filter]: key,
      },
    });
    return Promise.resolve(comments);
  }

  create(comment: Comment): Promise<any> {
    if (!this.validateConstraints(comment)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    try {
      L.info(`create ${model} with id ${comment.ID}`);
      const createdComment = prisma.comments.create({
        data: {
          Content: comment.Content,
          ContributionID: comment.ContributionID,
          UserID: comment.UserID,
        },
      });
      return Promise.resolve(createdComment);
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    const deletedComment = prisma.comments.delete({
      where: { ID: id },
    });
    return Promise.resolve(deletedComment);
  }

  update(id: number, comment: Comment): Promise<any> {
    if (!this.validateConstraints(comment)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    try {
      L.info(`update ${model} with id ${comment.ID}`);
      const updatedComment = prisma.comments.update({
        where: { ID: id },
        data: {
          Content: comment.Content,
          ContributionID: comment.ContributionID,
          UserID: comment.UserID,
        },
      });
      return Promise.resolve(updatedComment);
    } catch (error) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  private validateConstraints(comment: Comment): boolean {
    if (!comment.Content) {
      throw new Error('Content is required');
    }
    if (!comment.ContributionID) {
      throw new Error('ContributionID is required');
    }
    if (!comment.UserID) {
      throw new Error('UserID is required');
    }
    return true;
  }
}

export default new CommentsService();
