// models/Users.ts
import { Schema, model, Document, models } from 'mongoose';

export interface IUser extends Document {
    username: string;
    role: 'admin' | 'teacher' | 'viewer';
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
};

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, lowercase: true, trim: true },
        role: { type: String, enum: ['admin', 'teacher', 'viewer'], default: 'teacher', required: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true, select: false },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ updatedAt: -1 });

export const User = models.User || model<IUser>('User', UserSchema);