import mongoose, { Schema, model, Document, Types } from 'mongoose';

export interface IShortUrl extends Document {
  full_url: string;
  short_url: string;
  clicks: number;
  qrCode?: string;
  qrGenerated: boolean;
  expiresAt: Date | null;
  activeFrom: Date;
  isExpired: boolean;
  linkPassword?: string | null;
  isLinkPassword: boolean;
  user?: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const ShortUrlSchema = new Schema<IShortUrl>(
  {
    full_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    qrCode: {
      type: String, // base64 image
    },
    qrGenerated: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    activeFrom: {
      type: Date,
      default: Date.now,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    linkPassword: {
      type: String,
      default: null,
    },
    isLinkPassword: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ShortUrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ShortUrlModel = model<IShortUrl>('ShortUrl', ShortUrlSchema);

export default ShortUrlModel;