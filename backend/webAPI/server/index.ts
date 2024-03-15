import './common/env';
import Server from './common/server';
import routes from './routes';

const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
const port = Number(process.env.PORT) || 3001
export default new Server().router(routes).listen(port);
