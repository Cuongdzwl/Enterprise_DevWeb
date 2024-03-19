import { Application } from 'express';
import usersRouter from './api/controllers/users/router';
// import eventsRouter from './api/controllers/events/router';
// import eventsRouter from './api/controllers/events/router';
// import eventsRouter from './api/controllers/events/router';
// import authRouter from './api/controllers/auth/router';

export default function routes(app: Application): void {
  app.use('/api/v1/users', usersRouter);
  // app.use('/api/v1/events', eventsRouter);
  
  // app.use('/api/v1/auth',authRouter)
}
