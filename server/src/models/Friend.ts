import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema({
    userId: { type: String },
    friendId: { type: String },
    status: { type: String }
});

module.exports = mongoose.model('Friend', FriendSchema);
