import { Comment } from './../../models/Comment';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client'
import { Filter } from 'server/models/common/Filter';

const prisma = new PrismaClient()
const model = 'comments';

export class CommentsService{
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

filter(filter: Filter): Promise<any> {
    L.info(`fetch ${model}(s) with filter`, filter);
    const comments = prisma.comments.findMany({
        where: {
            // TODO: Apply filter conditions
        },
    });
    return Promise.resolve(comments);
}

create(comment: Comment): Promise<any> {
    L.info(`create ${model} with id ${comment.ID}`);
    const createdComment = prisma.comments.create({
        // TODO: FIX THIS
        data: comment,
    });
    return Promise.resolve(createdComment);
}

delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    const deletedComment = prisma.comments.delete({
        where: { ID: id },
    });
    return Promise.resolve(deletedComment);
}

update(comment: Comment): Promise<any> {
    L.info(`update ${model} with id ${comment.ID}`);
    const updatedComment = prisma.comments.update({
        where: { ID: comment.ID },
        data: comment,
    });
    return Promise.resolve(updatedComment);
}

}

export default new CommentsService();
