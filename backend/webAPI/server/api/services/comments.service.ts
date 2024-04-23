import { Comment } from '../models/Comment';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { CommentExceptionMessage, ExceptionMessage } from '../common/exception';
import notificationsService from './notifications.service';
import userServices from './users.service'; // Import the userServices module
import { NotificationSentTypeEnum } from '../models/NotificationSentType';
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
      // Create Comment
      const createdComment = prisma.comments
        .create({
          data: {
            Content: comment.Content,
            ContributionID: Number(comment.ContributionID),
            UserID: Number(comment.UserID),
          },
        })
        .then(async (r) => {
          // Fetch Commented Contribution
          const contribution: Contribution | undefined =
            await contributionsService
              .byId(r.ContributionID)
              .then(async (contribution: Contribution) => {
                // Check if the user is commenting on their own contribution
                if (r.UserID == contribution.UserID) {
                  L.info("User commenting on their own contribution")
                  // Send notification to the coordinator if the last one comment is him
                  var replies = await prisma.comments
                    .findMany({
                      where: {
                        ContributionID: Number(comment.ContributionID),
                      },
                      orderBy: { CreatedAt: 'desc' },
                      skip: 1,
                      take: 1,
                    })
                    .catch((err) => {
                      L.error(err);
                      return Promise.resolve(null);
                    });
                    L.info(replies)
                    if(replies== null){
                      return undefined;
                    }
                    const reply : any = replies[0]; 
                  if (reply != null) {
                    L.info(
                      reply,
                      `last comment by ${reply?.UserID} on contribution ${reply?.ContributionID}`
                    );
                    if (reply) {
                      L.info(reply)
                      //find commenter name
                      var commenter = await prisma.users.findUnique({select: {Name: true}, where: {ID: r.UserID}}).catch((err) => {L.error(err); return {Name: "Student"};});
                      // Check if the last comment is not from the same user
                      L.info("Commenter " + commenter?.Name)
                      if (reply.UserID != r.UserID) {
                        prisma.users.findUnique({
                          where: { ID: reply.UserID },
                        }).then((user) => {
                          if(user == null) return
                          notificationsService.trigger(
                            user as User,
                            {
                              Commenter: {
                                Name: commenter?.Name || "Student",
                              },
                              Contribution: {
                                ID: contribution.ID,
                                Name: contribution?.Name,
                              },
                              Event: {
                                ID: contribution.EventID,
                              },
                            },
                            NotificationSentTypeEnum.COMMENTCOORDINATORREPLY,
                            NotificationSentThrough.InApp
                          ).catch((err) => {L.error(err); return;});
                        }).catch((err) => {L.error(err); return;})
                      }else{
                        L.info("NO0000000000000000000000000000000000000000")
                        L.info(reply.UserID + "")
                        L.info(r.UserID + "")
                        L.info("NO0000000000000000000000000000000000000000")
                      }
                    }else{
                      L.info("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO" + reply)

                    }
                  }

                  return undefined;
                }
                // Send notification to the coordinator if the last one
                return contribution;
              })
              .catch((_) => {
                return undefined;
              });
          if (!contribution) {
            return r;
          }
          // Find commenter name
          var commenter = await prisma.users.findUnique({select: {Name: true}, where: {ID: r.UserID}}).catch((err) => {L.error(err); return {Name: "Student"};});
          // Send comment to contribution owner
          userServices.byId(contribution.UserID).then((user: User) => {
            notificationsService.trigger(
              user,
              {
                Commenter: {
                  Name: commenter?.Name || "Coordinator",
                },
                Contribution: {
                  ID: contribution.ID,
                  Name: contribution?.Name,
                },
                Event: {
                  ID: contribution.EventID,
                },
              },
              NotificationSentTypeEnum.COMMENTONCONTRIBUTION,
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
      const updatedComment = prisma.comments
        .update({
          where: { ID: id },
          data: {
            Content: comment.Content,
            ContributionID: comment.ContributionID,
            UserID: comment.UserID,
          },
        })
        .catch((err) => {
          L.error(`update ${model} failed: ${err}`);
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
        message: 'Contribution ID must be provided',
      };
    }
    if (!/^\d{1,20}$/.test(comment.ContributionID.toString())) {
      return {
        isValid: false,
        error: CommentExceptionMessage.INVALID_CONTRIBUTIONID,
        message: 'ContributionID must be numbers and not exceed 20 digits.',
      };
    }
    const contributionExists = await prisma.contributions.findUnique({
      where: { ID: Number(comment.ContributionID) },
    });
    if (!contributionExists) {
      return {
        isValid: false,
        error: CommentExceptionMessage.INVALID_CONTRIBUTIONID,
        message: 'Referenced Contribution does not exist.',
      };
    }

    // If all validations pass
    return { isValid: true };
  }
}

export default new CommentsService();
