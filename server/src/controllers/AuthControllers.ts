import { Request, Response } from 'express';

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateTokens = (payload: any) => {
    const { _id, username } = payload;
    const accessToken = jwt.sign({ _id: _id.toString(), name: username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '48h'
    });

    return { accessToken };
};

const updateToken = async (id: string, accessToken: string) => {
    await User.findOneAndUpdate(
        { _id: id.toString() },
        { accessToken: accessToken },
        {
            new: true
        }
    );
};

const verify = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return { valid: true, expired: false, decoded };
    } catch (error) {
        let msg;
        if (error instanceof Error) {
            msg = error.message;
        } else {
            msg = error;
        }
        return {
            valid: false,
            expired: msg === 'jwt expired',
            msg: msg,
            decoded: null
        };
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body.email }).lean();
        if (user) {
            res.status(409).json('Already has user');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body?.password, salt);

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                accessToken: ''
            });

            await newUser.save();
            res.status(201).json('OK');
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: req.body?.email }).lean();
        if (!user) {
            res.status(401).json('User not found');
        }

        bcrypt.compare(req.body.password, user.password, (err: any, hash: any) => {
            if (err || !hash) {
                res.status(403).send('Password does not match');
            } else {
                const token = generateTokens(user);
                updateToken(user._id, token.accessToken);
                res.status(200).json({ token, id: user._id.toString(), avatar: user?.avatar || '' });
            }
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getUser = async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL as string);
    res.setHeader('Access-Control-Allow-Headers', 'token');

    try {
        const { token } = req.headers;

        if (!token || typeof token !== 'string') {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const dataDecode = verify(String(token));

        if (!dataDecode) {
            res.status(500).json('Có lỗi');
        }

        const { _id } = dataDecode?.decoded;

        const user = await User.findOne({ _id });

        if (!user) {
            res.status(401).json('Not exist');
        } else {
            res.status(201).json(user);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
