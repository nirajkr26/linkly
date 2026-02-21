import UserModel, {type IUser } from '../models/user.model';
import ShortUrlModel, {type IShortUrl } from '../models/shortUrl.model';
import { Types } from 'mongoose';

/**
 * Finds a user by email and explicitly selects the password field
 * (Required for login because password is select: false in schema)
 */
const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return await UserModel.findOne({ email }).select('+password');
};

/**
 * Creates a new user in the database
 */
const createUser = async (name: string, email: string, password?: string): Promise<IUser> => {
  const newUser = new UserModel({
    name,
    email,
    password,
  });
  
  await newUser.save();
  return newUser;
};


export { 
  findUserByEmail, 
  createUser, 
  
};