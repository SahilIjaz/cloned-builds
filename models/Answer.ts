import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer extends Document {
  questionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  userEmail: string;
  userImage?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
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
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AnswerSchema.index({ questionId: 1, createdAt: 1 });
AnswerSchema.index({ userId: 1 });

const Answer =
  mongoose.models.Answer ||
  mongoose.model<IAnswer>('Answer', AnswerSchema);

export default Answer;
