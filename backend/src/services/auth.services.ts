import { createUser, findUserByEmail } from '../dao/user.dao';
import { ConflictError, UnauthorizedError } from '../utils/errorHandler';
import { signToken } from '../utils/jwtHelper';
import { type IUser } from '../models/user.model';

/**
 * Interface for the auth service response
 */
interface AuthResponse {
    token: string;
    user: IUser;
}

/**
 * Handles user registration logic
 */
const signupService = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new ConflictError('User already exists');
    }

    const newUser = await createUser(name, email, password);

    // We pass a simple payload object to signToken
    const token = signToken({ id: newUser._id.toString() });

    return { token, user: newUser };
};

/**
 * Handles user login and password verification
 */
const loginService = async (email: string, password: string): Promise<AuthResponse> => {
    // findUserByEmail should return Promise<IUser | null>
    const user = await findUserByEmail(email);

    // Using UnauthorizedError (401) is usually better for "Invalid credentials" than Conflict
    if (!user) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // comparePassword is available because 'user' is typed as 'IUser'
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials');
    }

    const token = signToken({ id: user._id.toString() });

    return { token, user };
};

export { signupService, loginService };