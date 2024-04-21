import { Application } from 'express';
import usersRouter from './api/controllers/users/router';
import facultiesRouter from './api/controllers/faculties/router';
import filesRouter from './api/controllers/files/router';
import contributionsRouter from './api/controllers/contributions/router';
import commentsRouter from './api/controllers/comments/router';
import eventsRouter from './api/controllers/events/router';
import authRouter from './api/controllers/auth/router';
import rolesRouter from './api/controllers/roles/router';
import statusRouter from './api/controllers/contributionstatus/router';

export default function routes(app: Application): void {
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/faculties', facultiesRouter);
  app.use('/api/v1/files', filesRouter);
  app.use('/api/v1/contributions', contributionsRouter);
  app.use('/api/v1/comments', commentsRouter);
  app.use('/api/v1/events', eventsRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/roles', rolesRouter);
  app.use('/api/v1/status', statusRouter);
}
