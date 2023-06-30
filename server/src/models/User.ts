import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 3,
            max: 20,
            unique: true
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            min: 6
        },
        gender: {
            type: String
        },
        location: {
            type: String
        },
        facebookLink: {
            type: String
        },
        description: {
            type: String
        },
        accessToken: {
            type: String
        },
        avatar: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
