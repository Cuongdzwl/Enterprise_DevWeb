import './common/env';
import Server from './common/server';
import routes from './routes';

const port = Number(process.env.PORT) || 3000
export default new Server().router(routes).listen(port);
