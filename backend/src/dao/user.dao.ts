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

/**
 * Finds a user by their MongoDB ObjectId
 */
const findUserById = async (id: string | Types.ObjectId): Promise<IUser | null> => {
  return await UserModel.findById(id);
};

/**
 * Fetches all URLs owned by a specific user, sorted by most recent
 */
const getAllUserUrls = async (id: string | Types.ObjectId): Promise<IShortUrl[]> => {
  return await ShortUrlModel.find({ user: id }).sort({ createdAt: -1 });
};

/**
 * Updates a specific URL only if it belongs to the requesting user
 */
const updateUserUrl = async (
  userId: string | Types.ObjectId,
  urlId: string | Types.ObjectId,
  updateData: Partial<IShortUrl>
): Promise<IShortUrl | null> => {
  return await ShortUrlModel.findOneAndUpdate(
    { _id: urlId, user: userId },
    updateData,
    { new: true }
  );
};

/**
 * Deletes a specific URL only if it belongs to the requesting user
 */
const deleteUserUrl = async (
  userId: string | Types.ObjectId,
  urlId: string | Types.ObjectId
): Promise<IShortUrl | null> => {
  return await ShortUrlModel.findOneAndDelete({ _id: urlId, user: userId });
};

export { 
  findUserByEmail, 
  createUser, 
  findUserById, 
  getAllUserUrls, 
  updateUserUrl, 
  deleteUserUrl 
};