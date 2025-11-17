import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
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

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema({
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
      name: String,
      price: Number,
      imageUrl: String,
      category: String,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
