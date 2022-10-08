import { Order, clearObjectOwnProperties, OrderStatus } from "@shbooks/common";
import {
  Document,
  model,
  Model,
  Schema,
  SchemaOptions,
} from "mongoose";

export interface OrderDocument extends Document, Omit<Order, "id"> {
  toOrderModel(): Order;
}

export interface OrderModel extends Model<OrderDocument> {
  build(order: Order): OrderDocument;
  insert(order: Order): Promise<OrderDocument>;
}

const schemaOptions: SchemaOptions = {
  toJSON: {
    transform(document: OrderDocument, returnValue) {
      clearObjectOwnProperties(returnValue); // remove mongo specific properties and naming conventions
      returnValue.id = document.id;
      returnValue.userId = document.userId;
      returnValue.book = document.book;
      returnValue.status = document.status;
      returnValue.placedAt = document.placedAt;
      returnValue.expireAt = document.expireAt;
    },
  },
  timestamps: {
    createdAt: "placedAt",
  },
};

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book'
    },
    status: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.Placed,
    },
    expireAt: Schema.Types.Date,
  },
  schemaOptions
);

orderSchema.statics.build = (order: Order) => new OrderCollection(order);
orderSchema.statics.insert = (order: Order) => OrderCollection.create(order);
orderSchema.methods.toOrderModel = function () {
  return this.toJSON();
};

const OrderCollection = model<OrderDocument, OrderModel>("Order", orderSchema);

export default OrderCollection;
