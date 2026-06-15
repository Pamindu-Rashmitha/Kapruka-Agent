import mongoose, { Schema, type Document } from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  imageUrl?: string;
}

export interface ISession extends Document {
  sessionId: string;
  chatHistory: Array<{
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    toolCalls?: any[];
    toolResults?: any[];
  }>;
  currentCart: ICartItem[];
  deliveryLocation: {
    city?: string;
    date?: string;
  };
  discussedItems: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    quantity: { type: Number, default: 1, min: 1 },
    imageUrl: { type: String },
  },
  { _id: false }
);

const SessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    chatHistory: [
      {
        role: { type: String, enum: ['user', 'assistant', 'system', 'tool'], required: true },
        content: { type: String, default: '' },
        toolCalls: { type: Schema.Types.Mixed },
        toolResults: { type: Schema.Types.Mixed },
      },
    ],
    currentCart: [CartItemSchema],
    deliveryLocation: {
      city: { type: String },
      date: { type: String },
    },
    discussedItems: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Keep discussedItems capped at last 10
SessionSchema.methods.addDiscussedItem = function (productId: string) {
  if (!this.discussedItems.includes(productId)) {
    this.discussedItems.push(productId);
    if (this.discussedItems.length > 10) {
      this.discussedItems = this.discussedItems.slice(-10);
    }
  }
};

// TTL: auto-delete sessions after 24 hours of inactivity
SessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
