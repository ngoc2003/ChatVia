import express, { Express, Request, Response } from 'express';
import mongoose, { ConnectOptions, Error } from 'mongoose';
const http = require('http');
import cors from 'cors';
const application: Express = express();
const authRouter = require('./routes/Auth');
const conversationRouter = require('./routes/Conversation');
const messageRouter = require('./routes/Message');
const userRouter = require('./routes/User');
const dotenv = require('dotenv');
const url = process.env.MONGODB_URL || 'mongodb+srv://buithuyngoc:ikCcnAqzr7K6XOVH@cluster0.y1wuxrs.mongodb.net/?retryWrites=true';
dotenv.config();
/** Server Handling */
const httpServer = http.createServer(application);

/** Log the request */
application.use((req: Request, res: Response, next) => {
    console.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        console.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
application.use(express.urlencoded({ extended: true }));
application.use(express.json());

application.use(cors({ origin: true }));
application.use((_: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Authorization'
    );
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 1);

    next();
});

/** Healthcheck */
application.get('/ping', (_: Request, res: Response, next) => {
    return res.status(200).json({ hello: 'world!' });
});

application.use('/auth', authRouter);
application.use('/users', userRouter);
application.use('/conversations', conversationRouter);
application.use('/messages', messageRouter);

/** Error handling */
application.use((_, res: Response) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

/** Mongoose connect */
mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
    .then(() => {
        console.log('Kết nối thành công !');
    })
    .catch((err: Error) => {
        throw err;
    });

/** Listen */
httpServer.listen(4000, () => console.info(`Server is running`));
