import { Request, Response } from 'express';
const User = require('../models/User');
const Friend = require('../models/Friend');

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.query?.userId;
        const username = req.query?.username;
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
        const { password, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getUsersByIdList = async (ids: string[]) => {
    const users = await User.find({ _id: { $in: ids } }, { password: 0, accessToken: 0 });

    return users;
};

export const addFriend = async (userId: string, friendId: string) => {
    const friend = new Friend({
        userId,
        friendId,
        status: 'success'
    });
    await friend.save();
};

export const updateInformation = async (req: Request, res: Response) => {
    try {
        const userId = req.query?.userId;
        const information = req.body;
        const user = await User.findOneAndUpdate({ _id: userId }, information);
        const { password, ...other } = user._doc;

        res.status(201).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getListFriend = async (req: Request, res: Response) => {
    try {
        const userId = req.query?.userId;
        const searchValue = req.query?.searchValue || '';

        const friends = await Friend.find({
            friendId: {
                $in: await User.distinct('_id', {
                    username: { $regex: searchValue, $options: 'i' }
                })
            },
            $or: [{ userId: userId }, { friendId: userId }],
            status: 'success'
        });

        const friendIds = friends.map((friend: any) => {
            if (friend.friendId !== userId) {
                return friend.friendId;
            }
            return friend.userId;
        });

        const friendInformation = await getUsersByIdList(friendIds);

        res.json(friendInformation);
    } catch (err) {
        res.status(500).json(err);
    }
};
