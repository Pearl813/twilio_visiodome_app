import './bootstrap-globals';
import { createExpressHandler } from './createExpressHandler';
import { createRoom, completeRoom, checkValidRoom} from './roomHandler';
import { checkIsPresenter, checkIsValidUser, login } from './userHandler';
import express, { RequestHandler } from 'express';
import path from 'path';
import { ServerlessFunction } from './types';
import bodyParser from 'body-parser';

var cors = require('cors');

const PORT = process.env.PORT ?? 8081;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded());

// This server reuses the serverless endpoints from the "plugin-rtc" Twilio CLI Plugin, which is used when the "npm run deploy:twilio-cli" command is run.
// The documentation for this endpoint can be found in the README file here: https://github.com/twilio-labs/plugin-rtc
const tokenFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/token').handler;
const tokenEndpoint = createExpressHandler(tokenFunction);

const recordingRulesFunction: ServerlessFunction = require('@twilio-labs/plugin-rtc/src/serverless/functions/recordingrules')
  .handler;
const recordingRulesEndpoint = createExpressHandler(recordingRulesFunction);

const noopMiddleware: RequestHandler = (_, __, next) => next();
const authMiddleware =
  process.env.REACT_APP_SET_AUTH === 'firebase' ? require('./firebaseAuthMiddleware') : noopMiddleware;

app.all('/token', authMiddleware, tokenEndpoint);
app.all('/recordingrules', authMiddleware, recordingRulesEndpoint);
app.all('/rooms/start', authMiddleware, createRoom);
app.all('/rooms/end', authMiddleware, completeRoom);
app.all('/rooms/validate', authMiddleware, checkValidRoom);
app.all('/users/validate-presenter', authMiddleware, checkIsPresenter);
app.all('/users/validate-user', authMiddleware, checkIsValidUser);
app.all('/users/login', authMiddleware, login);

app.use((req, res, next) => {
  // Here we add Cache-Control headers in accordance with the create-react-app best practices.
  // See: https://create-react-app.dev/docs/production-build/#static-file-caching
  if (req.path === '/' || req.path === 'index.html') {
    res.set('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
  } else {
    res.set('Cache-Control', 'max-age=31536000');
    next();
  }
});

app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (_, res) => {
  // Don't cache index.html
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/index.html'), { etag: false, lastModified: false });
});

app.listen(PORT, () => console.log(`twilio-video-app-react server running on ${PORT}`));
