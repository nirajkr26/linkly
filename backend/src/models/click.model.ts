import mongoose, { Schema, model, Document, Types } from 'mongoose';

export type DeviceType = "mobile" | "desktop";

export interface IClick extends Document {
  urlId: Types.ObjectId;
  ip?: string;
  deviceType: DeviceType;
  createdAt: Date;
  updatedAt: Date;
}

const clickSchema = new Schema<IClick>(
  {
    urlId: {
      type: Schema.Types.ObjectId,
      ref: "ShortUrl",
      required: true,
    },
    ip: {
      type: String,
    },
    deviceType: {
      type: String,
      enum: ["mobile", "desktop"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ClickModel = model<IClick>("Click", clickSchema);

export default ClickModel;