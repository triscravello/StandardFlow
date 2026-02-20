// /services/authService.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@/models/Users'; 
import { IUser } from '@/models/Users';

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const SALT_ROUNDS = 10;

export interface AuthTokenPayload {
    id: string;
    role: 'admin' | 'teacher' | 'viewer';
    iat: number;
    exp: number;
}

export async function registerUser(username: string, email: string, password: string, role: 'admin' | 'teacher' | 'viewer' = 'teacher'): Promise<IUser> {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = new User({ username, email, passwordHash, role });
    const user = await newUser.save();
    return user.toObject({ versionKey: false });
}

export async function authenticateUser(username: string, password: string): Promise<string | null> {
    const user = await User.findOne({ $or: [{username}, { email: username }] }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new Error('Invalid username or password');
    }

    return jwt.sign(
        { id: user._id.toString(), role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

export function verifyToken(token: string): AuthTokenPayload | null{
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (
            typeof decoded === 'object' &&
            decoded !== null && 
            'id' in decoded &&
            'role' in decoded
        ) {
            return decoded as AuthTokenPayload;
        }
        return null;
    } catch (err) {
        return null;
    }
}

export async function getUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId).lean();
}

export async function changeUserPassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const updated = await User.findByIdAndUpdate(userId, { passwordHash });
    if (!updated) throw new Error('User not found');
}

export async function getAllUsers(): Promise<IUser[]> {
    return await User.find().lean();
}

export async function deleteUser(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'teacher' | 'viewer'): Promise<void> {
    await User.findByIdAndUpdate(userId, { role: newRole });
}

// Add more authentication and user management functions as needed