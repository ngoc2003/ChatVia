import { Request, Response } from 'express';
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

export const createMessage = async (req: Request, res: Response) => {
    const message = new Message(req.body);
    try {
        const savedMessage = await message.save();
        try {
            await Conversation.findOneAndUpdate(
                { _id: savedMessage.conversationId },
                {
                    $set: {
                        lastMessage: {
                            id: savedMessage.sender,
                            text: savedMessage.text,
                            createdAt: savedMessage.createdAt
                        }
                    }
                }
            );
        } catch (error) {
            console.log(error);
        }

        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const { messageId } = req.params;
        await Message.updateOne({ _id: messageId }, { $push: { deletedBy: { userId, deletedAt: new Date() } } });
        res.status(201).json('OK');
    } catch (err) {
        res.status(500).json(err);
    }
};

export const pinMessage = async (req: Request, res: Response) => {
    const { messageId } = req.params;
    const { isPin } = await Message.findOne({ _id: messageId });
    if (!isPin) {
        await Message.updateOne({ _id: messageId }, { isPin: true });
    }
    res.status(201).json('OK');
};

export const unpinMessage = async (req: Request, res: Response) => {
    const { messageId } = req.params;
    await Message.updateOne({ _id: messageId }, { isPin: false });
    res.status(201).json('OK');
};

export const getMessageByConversationId = async (req: Request, res: Response) => {
    try {
        const { userId, ...filter } = req.query;
        const lastDeletedConversation = await Conversation.findOne({
            _id: req.params.conversationId
        }).select('deletedBy');

        const result = lastDeletedConversation?.deletedBy.find((item: any) => item.userId === userId);

        const messages = await Message.find({
            conversationId: req.params.conversationId,
            deletedBy: { $not: { $elemMatch: { userId: userId } } },
            ...(result?.deletedAt && {
                createdAt: { $gt: result.deletedAt }
            }),
            ...(filter && filter)
        }).lean();

        res.status(201).json(messages);
    } catch (err) {
        console.error('Error querying messages:', err);
        res.status(500).json(err);
    }
};
