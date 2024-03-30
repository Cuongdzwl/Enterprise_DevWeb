import { Comment } from '../models/Comment';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { CommentExceptionMessage, ExceptionMessage } from '../common/exception';
import notificationsService from './notifications.service';
import userServices from './users.service'; // Import the userServices module
import { NotificationSentType } from '../models/NotificationSentType';
import { NotificationSentThrough } from '../models/NotificationSentThrough';
import { User } from '../models/User';
import contributionsService from './contributions.service';
import { Contribution } from '../models/Contribution';

const prisma = new PrismaClient();
const model = 'comments';

export class CommentsService implements ISuperService<Comment> {
  all(depth?: number): Promise<any> {
    var select: any = {
      ID: true,
      Content: true,
      CreatedAt: true,
      UpdatedAt: true,
      ContributionID: true,
      UserID: true,
    };
    if (depth == 1) {
      select.User = { select: { ID: true, Name: true } };
      select.Contribution = { select: { ID: true, Name: true } };
    }
    const comments = prisma.comments.findMany({
      select,
      orderBy: [{ CreatedAt: 'desc' }],
    });
    L.info(comments, `fetch all ${model}(s)`);
    return Promise.resolve(comments);
  }

  byId(id: number, depth?: number): Promise<any> {
    var select: any = {
      ID: true,
      Content: true,
      CreatedAt: true,
      UpdatedAt: true,
      ContributionID: true,
      UserID: true,
    };
    if (depth == 1) {
      select.User = { select: { ID: true, Name: true } };
      select.Contribution = { select: { ID: true, Name: true } };
    }
    L.info(`fetch ${model} with id ${id}`);
    const comment = prisma.comments.findUnique({
      select,
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
      const createdComment = prisma.comments
        .create({
          data: {
            Content: comment.Content,
            ContributionID: comment.ContributionID,
            UserID: comment.UserID,
          },
        })
        .then(async (r) => {
          const contribution = await contributionsService
            .byId(r.ContributionID)
            .then((contribution: Contribution) => {
              if (r.UserID == contribution.UserID) return contribution;
              return;
            })
            .catch((_) => {
              return;
            });
          if (await contribution) {
            return r;
          }

          userServices.byId(r.UserID).then((user: User) => {
            notificationsService.trigger(
              user,
              {
                Commenter: {
                  Name: user.Name,
                },
                Contribution: {
                  Name: contribution?.Name || 'Student',
                },
              },
              NotificationSentType.COMMENTONCONTRIBUTION,
              NotificationSentThrough.InApp
            );
          });
          return r;
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
    return prisma.comments
      .delete({
        where: { ID: id },
      })
      .then((r) => {
        return Promise.resolve(r);
      })
      .catch((err) => {
        L.error(`delete ${model} failed: ${err}`);
        return Promise.resolve({
          error: ExceptionMessage.INVALID,
          message: ExceptionMessage.BAD_REQUEST,
        });
      });
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
  async validateConstraints(
    comment: Comment
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    // Validate Content
    if (!comment.Content || comment.Content.length > 1000) {
      return {
        isValid: false,
        error: ExceptionMessage.INVALID,
        message:
          'Comment content is invalid or too long, with a maximum of 1000 characters.',
      };
    }
    // Validate ContributionID and UserID
    if (
      comment.ContributionID === null ||
      comment.ContributionID === undefined ||
      !comment.ContributionID
    ) {
      return {
        isValid: false,
        error: CommentExceptionMessage.INVALID_CONTRIBUTIONID,
        message:
          'Contribution ID must be a number with a maximum of 20 digits.',
      };
    }
    if (
      !/^\d{1,20}$/.test(comment.ContributionID.toString()) ||
      !/^\d{1,20}$/.test(comment.UserID.toString())
    ) {
      return {
        isValid: false,
        error: CommentExceptionMessage.INVALID_CONTRIBUTIONID,
        message: 'ContributionID must be numbers and not exceed 20 digits.',
      };
    }
    const contributionExists = await prisma.contributions.findUnique({
      where: { ID: comment.ContributionID },
    });
    if (!contributionExists) {
      return {
        isValid: false,
        error: CommentExceptionMessage.INVALID_CONTRIBUTIONID,
        message: 'Referenced Contribution does not exist.',
      };
    }
    if (
      comment.UserID === null ||
      comment.UserID === undefined ||
      !comment.UserID
    ) {
      return {
        isValid: false,
        error: CommentExceptionMessage.INVALID_CONTRIBUTIONID,
        message: 'User ID must be a number with a maximum of 20 digits.',
      };
    }

    if (
      !/^\d{1,20}$/.test(comment.UserID.toString()) ||
      !/^\d{1,20}$/.test(comment.UserID.toString())
    ) {
      return {
        isValid: false,
        error: CommentExceptionMessage.INVALID_CONTRIBUTIONID,
        message: 'User ID must be numbers and not exceed 20 digits.',
      };
    }

    const userExists = await prisma.users.findUnique({
      where: { ID: comment.UserID },
    });
    if (!userExists) {
      return {
        isValid: false,
        error: CommentExceptionMessage.INVALID_USERID,
        message: 'Referenced User ID does not exist.',
      };
    }

    // If all validations pass
    return { isValid: true };
  }
}

export default new CommentsService();
