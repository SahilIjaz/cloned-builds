import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  userEmail: string;
  userImage?: string;
  content: string;
  answerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userEmail: {
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
    },
    answerCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ userId: 1 });

const Question =
  mongoose.models.Question ||
  mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
