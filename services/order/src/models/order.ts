import { Order, clearObjectOwnProperties, OrderStatus } from "@shbooks/common";
import {
  Document,
  model,
  Model,
  Schema,
  SchemaOptions,
} from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface OrderDocument extends Document, Omit<Order, "id"> {
  toModel(): Order;
  version: number;
}

type OrderAttr = Omit<Order, 'id' | 'placedAt'>;
export interface OrderModel extends Model<OrderDocument> {
  build(order: OrderAttr): OrderDocument;
  insert(order: OrderAttr): Promise<OrderDocument>;
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
      returnValue.version = document.version;
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

// For optimistic concurrency control
orderSchema.set('versionKey', 'version'); 
orderSchema.plugin(updateIfCurrentPlugin);

const OrderCollection = model<OrderDocument, OrderModel>("Order", orderSchema);

export default OrderCollection;
