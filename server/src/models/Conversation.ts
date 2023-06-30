import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
    {
        createdBy: {
            type: String
        },
        members: {
            type: Array
        },
        lastMessage: {
            id: { type: String },
            text: { type: String },
            createdAt: { type: Date }
        },
        deletedBy: [
            {
                userId: {
                    type: String
                },
                deletedAt: {
                    type: Date
                }
            }
        ],
        emoji: {
            type: String,
            default: '❤️'
        },
        status: {
            type: String,
            default: 'pending'
        },
        blockedByUser: String
    },
    { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);
