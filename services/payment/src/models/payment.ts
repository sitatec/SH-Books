import { clearObjectOwnProperties } from "@shbooks/common";
import {
  Payment,
  Payment as PaymentCollection,
} from "@shbooks/common/lib/models/payment";
import { Document, Model, model, Schema } from "mongoose";

interface PaymentDoc extends Document, Omit<Payment, "id"> {
  toModel(): Payment;
}

interface PaymentModel extends Model<PaymentDoc> {
  build(attrs: Omit<Payment, "id">): PaymentDoc;
}

const paymentSchema = new Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    paymentGatewayId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(document: PaymentDoc, returnValue) {
        clearObjectOwnProperties(returnValue);
        returnValue.id = document.id;
        returnValue.orderId = document.orderId;
        returnValue.paymentGatewayId = document.paymentGatewayId;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: Payment) => {
  return new PaymentCollection(attrs);
};
paymentSchema.methods.toModel = function () {
  return this.toJSON();
};

const PaymentCollection = model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);

export default PaymentCollection;
