import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus, signup } from "@shbooks/common";
import { stripe } from "../../src/stripe";
import app from "../../src/app";
import OrderCollection from "../../src/models/order";
import PaymentCollection from "../../src/models/payment";

const user = {
  id: new mongoose.Types.ObjectId().toHexString(),
  email: "sita@shbooks.com",
  password: "ljfslS4Rfl",
  firstName: "first",
  lastName: "last",
};

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(user))
    .send({
      token: "asldkfj",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = OrderCollection.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Placed,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(user))
    .send({
      token: "asldkfj",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const order = OrderCollection.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: user.id,
    version: 0,
    price: 20,
    status: OrderStatus.Canceled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signup(user))
    .send({
      orderId: order.id,
      token: "asdlkfj",
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const price = Math.floor(Math.random() * 100000);
  const order = OrderCollection.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: user.id,
    version: 0,
    price,
    status: OrderStatus.Placed,
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", signup(user))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual("tok_visa");
    expect(chargeOptions.amount).toEqual(price * 100 /* Cents*/);
    expect(chargeOptions.currency).toEqual("usd" /* Cents*/);

  const payment = await PaymentCollection.findOne({
    orderId: order.id,
    stripeId: response.body.id,
  });
  expect(payment).not.toBeNull();
});
