import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReply extends Document {
  buildId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  userImage?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema<IReply>(
  {
    buildId: {
      type: Schema.Types.ObjectId,
      ref: 'Build',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ReplySchema.index({ buildId: 1, createdAt: -1 });

const Reply: Model<IReply> =
  mongoose.models.Reply || mongoose.model<IReply>('Reply', ReplySchema);

export default Reply;
