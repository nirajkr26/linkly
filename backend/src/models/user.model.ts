import mongoose, { Schema, model, Document, Model } from 'mongoose';
import argon2 from 'argon2';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    avatar?: string;
    provider: 'local' | 'google';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(plainPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        avatar: {
            type: String,
        },
        provider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    timeCost: 3,
    memoryCost: 2 ** 16,
    parallelism: 1,
};

//Password Hashing Middleware
UserSchema.pre('save', async function () {
    if (!this.password || !this.isModified('password')) {
        return;
    }

    try {
        this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
    } catch (err) {
        throw err;
    }
});

//Instance Method for Password Comparison
UserSchema.methods.comparePassword = async function (plainPassword: string): Promise<boolean> {
    if (!this.password) return false;
    try {
        return await argon2.verify(this.password, plainPassword);
    } catch (err) {
        return false;
    }
};


const UserModel = model<IUser>('User', UserSchema);

export default UserModel;