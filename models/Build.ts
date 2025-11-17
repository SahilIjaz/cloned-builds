import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComponent {
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
}

export interface IBuild extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  username: string;
  userEmail: string;
  userImage?: string;
  description?: string;
  components?: {
    cpu?: IComponent;
    gpu?: IComponent;
    motherboard?: IComponent;
    ram?: IComponent;
    storage?: IComponent;
    psu?: IComponent;
    case?: IComponent;
    cooling?: IComponent;
  };
  totalPrice?: number;
  isPublic: boolean;
  viewCount: number;
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BuildSchema = new Schema<IBuild>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
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
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    components: {
      cpu: {
        type: {
          name: { type: String },
          price: { type: Number },
          imageUrl: { type: String },
          category: { type: String },
        },
        required: false,
      },
      gpu: {
        type: {
          name: { type: String },
          price: { type: Number },
          imageUrl: { type: String },
          category: { type: String },
        },
        required: false,
      },
      motherboard: {
        type: {
          name: { type: String },
          price: { type: Number },
          imageUrl: { type: String },
          category: { type: String },
        },
        required: false,
      },
      ram: {
        type: {
          name: { type: String },
          price: { type: Number },
          imageUrl: { type: String },
          category: { type: String },
        },
        required: false,
      },
      storage: {
        type: {
          name: { type: String },
          price: { type: Number },
          imageUrl: { type: String },
          category: { type: String },
        },
        required: false,
      },
      psu: {
        type: {
          name: { type: String },
          price: { type: Number },
          imageUrl: { type: String },
          category: { type: String },
        },
        required: false,
      },
      case: {
        type: {
          name: { type: String },
          price: { type: Number },
          imageUrl: { type: String },
          category: { type: String },
        },
        required: false,
      },
      cooling: {
        type: {
          name: { type: String },
          price: { type: Number },
          imageUrl: { type: String },
          category: { type: String },
        },
        required: false,
      },
    },
    totalPrice: {
      type: Number,
      min: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    replyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
BuildSchema.index({ createdAt: -1 });
BuildSchema.index({ userId: 1, createdAt: -1 });
BuildSchema.index({ isPublic: 1, createdAt: -1 });

const Build: Model<IBuild> =
  mongoose.models.Build || mongoose.model<IBuild>('Build', BuildSchema);

export default Build;
