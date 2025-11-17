import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  buildId: mongoose.Types.ObjectId;
  buildName: string;
  components: {
    name: string;
    price: number;
    imageUrl?: string;
    category: string;
  }[];
  totalPrice: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'checkout' | 'completed' | 'cancelled';
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    items: [
      {
        buildId: {
          type: Schema.Types.ObjectId,
          ref: 'Build',
          required: true,
        },
        buildName: {
          type: String,
          required: true,
        },
        components: [
          {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            imageUrl: { type: String },
            category: { type: String, required: true },
          },
        ],
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'checkout', 'completed', 'cancelled'],
      default: 'pending',
    },
    stripeSessionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
