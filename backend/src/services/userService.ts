import { User } from '../models/User';
import { generateToken } from '../utils/auth';
import { validateInput, registerSchema, loginSchema } from '../utils/validation';
import { AuthResponse } from '../types';
import { USER_ROLES } from '../constants';
import { ConflictError, NotFoundError, AuthenticationError } from '../errors';

export class UserService {
  async register(
    username: string,
    email: string,
    password: string,
    role?: string
  ): Promise<AuthResponse> {
    // Validate input
    const validatedInput = validateInput(registerSchema, { username, email, password, role });

    const existingUser = await User.findOne({
      $or: [{ email: validatedInput.email }, { username: validatedInput.username }],
    });

    if (existingUser) {
      throw new ConflictError('User already exists with this email or username');
    }

    const user = new User({
      username: validatedInput.username,
      email: validatedInput.email,
      password: validatedInput.password,
      role: validatedInput.role || USER_ROLES.EMPLOYEE,
    });

    await user.save();

    const token = generateToken(user);

    return {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    // Validate input
    validateInput(loginSchema, { username, password });

    // Normalize username to lowercase for query (User schema has lowercase: true)
    const normalizedUsername = username.toLowerCase().trim();

    const user = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedUsername }],
    });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = generateToken(user);

    return {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getCurrentUser(userId: string) {
    // Use .lean() for read-only query to improve performance
    const user = await User.findById(userId).lean();
    if (!user) {
      throw new NotFoundError('User');
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }
}

export default new UserService();
