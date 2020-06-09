import Express from 'express';
import userRouter from './routes/users';
import cors from 'cors';
import quoteRouter from './routes/quote';
import { register, login , findByUsername} from './controllers/users';
import Logger from './utils/logger';
import {authMiddleware} from './utils/authenticate';

const logger = new Logger('Main', 'app.js');

const app = new Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

/**
 * Allow all request using Cors()
 * app.options() used to show which http methods are allowed
 * Cors module help in Cross origin request 
 */
app.options('*',cors());

/**
 * Req for end point /users ,/quotes
 * authMiddleware Middleware will restrict Unautorized User
 */
app.use('/users', cors(),authMiddleware, userRouter);
app.use('/quotes',cors(),authMiddleware, quoteRouter);

/**
 * end point /login (POST)
 */
app.post('/login', cors(),async (req, res) => {
  if (!req.body.username && !req.body.password) {
    logger.silly('Credential Not Found');
    res.status(401).json({
      err: 'Username and Password are required',
    });
  }
  const token = await login(req.body);
  if (token) {
    logger.silly('Successfully logged In');
    res.status(200).end(JSON.stringify(token, null,2));
    return;
  }
  res.status(401).json({
    err: 'Login failed!',
  });
});

/**
 * end point /resgister (POST)
 */
app.post('/register', cors(),async (req, res) => {
  try {
    if (!req.body.username && !req.body.password) {
    logger.silly('User Details Not Found');
      res.status(401).json({
        err: 'username and Password are required',
      });
      return;
    }
    const userexists = await findByUsername(req.body.username);
if(!userexists){
  await register(req.body);
  res.json({ status: 'ok' });
}
else{
  res.status(400).json({
    err: 'username exist',
  });
  return;
}
  } catch (err) {
    res.end(JSON.stringify(err));
  }
});

export default app;
