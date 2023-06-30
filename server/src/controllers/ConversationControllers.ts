import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { addFriend } from './UserControllers';

const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message');

export const createConversation = async (req: Request, res: Response) => {
    try {
        const { senderId, receiverEmail } = req.body;
        const receiver = await User.findOne({ email: receiverEmail });
        if (!receiver) {
            res.status(401).json('Not found');
        } else {
            const receiverId = receiver._id.toString();

            const conversationCheck = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });
            if (conversationCheck) {
                res.status(409).json('Conversation co roi');
            } else {
                const newConversation = new Conversation({
                    members: [senderId, receiverId],
                    createdBy: senderId
                });
                const savedConversation = await newConversation.save();
                res.status(200).json(savedConversation);
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteConversation = async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const conversation = await Conversation.findOne({ _id: conversationId });

    if (conversation) {
        const deletedByIndex = conversation.deletedBy.findIndex((item: any) => item.userId === userId);

        if (deletedByIndex !== -1) {
            conversation.deletedBy[deletedByIndex].deletedAt = new Date();
        } else {
            conversation.deletedBy.push({ userId, conversationId, deletedAt: new Date() });
        }
        await conversation.save();
        res.status(201).json('OK');
    } else {
        res.status(404).json('Conversation not found');
    }
};

export const blockConversation = async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const conversation = await Conversation.findOne({ _id: conversationId });

    if (conversation) {
        if (!conversation.blockedByUser) {
            conversation.blockedByUser = userId;
            await conversation.save();
            res.status(201).json('OK');
        }
    } else {
        res.status(404).json('Conversation not found');
    }
};

export const unBlockConversation = async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const conversation = await Conversation.findOne({ _id: conversationId });

    if (conversation) {
        conversation.blockedByUser = '';
        await conversation.save();
        res.status(201).json('OK');
    } else {
        res.status(404).json('Conversation not found');
    }
};

export const getConversation = async (req: Request, res: Response) => {
    const query = req.query?.searchValue || '';
    const status = req.query?.status;

    try {
        const ids = await User.distinct('_id', {
            $and: [{ username: { $regex: query, $options: 'i' } }, { _id: { $ne: req.params.userId } }]
        });

        const stringIds = ids.map((objectId: ObjectId) => objectId.toString());

        let matchConditions: any[] = [
            {
                $and: [{ members: { $in: [req.params.userId] } }, { members: { $in: stringIds } }]
            }
        ];

        if (status === 'pending') {
            matchConditions.push({
                $and: [
                    {
                        status: 'pending'
                    },
                    {
                        createdBy: { $ne: req.params.userId }
                    }
                ]
            });
        } else {
            matchConditions.push({
                $or: [{ createdBy: req.params.userId }, { status: 'accept' }]
            });
        }

        if (query) {
            matchConditions.push({
                _id: {
                    $in: await Message.distinct('conversationId', {
                        text: { $regex: query, $options: 'i' }
                    })
                }
            });
        }

        const conversation = await Conversation.aggregate([
            {
                $match: {
                    $and: matchConditions
                }
            },
            {
                $addFields: {
                    lastMessageCreatedAt: '$lastMessage.createdAt'
                }
            },
            {
                $match: {
                    $or: [
                        { deletedBy: { $exists: false } },
                        {
                            deletedBy: {
                                $not: {
                                    $elemMatch: { userId: req.params.userId }
                                }
                            }
                        },
                        {
                            $expr: {
                                $anyElementTrue: {
                                    $map: {
                                        input: '$deletedBy',
                                        as: 'deleted',
                                        in: {
                                            $and: [
                                                { $eq: ['$$deleted.userId', req.params.userId] }, //equal
                                                { $lt: ['$$deleted.deletedAt', '$lastMessageCreatedAt'] } //less than
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        res.status(200).json(conversation);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

export const updateConversation = async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const fieldToUpdate = req.body;
    if (fieldToUpdate?.status === 'accept') {
        const convsersation = await Conversation.findOne({ _id: conversationId });

        addFriend(convsersation.members[0], convsersation.members[1]);
    }
    try {
        await Conversation.findOneAndUpdate({ _id: conversationId }, fieldToUpdate);
        res.status(201).json('OK');
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getImage = async (req: Request, res: Response) => {
    const image_URL = process.env.IMAGES?.split(',')?.join('|');

    try {
        const messages = await Message.find({
            conversationId: req.query.conversationId,
            text: {
                $regex: image_URL,
                $options: 'i'
            }
        }).lean();

        const senderIds = messages.map((message: any) => message.sender);

        const senders = await User.find({ _id: { $in: senderIds } }).lean();

        const messagesWithUserInfo = messages.map((message: any) => {
            const senderInfo = senders.find((sender: any) => sender._id.toString() === message.sender);
            return {
                _id: message._id,
                text: message.text,
                conversationId: message.conversationId,
                createdAt: message.createdAt,
                senderInfo: {
                    _id: senderInfo._id,
                    username: senderInfo.username
                }
            };
        });

        res.status(200).json(messagesWithUserInfo);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred' });
    }
};
