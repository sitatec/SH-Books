import { NatsClientWrapper, OrderStatus } from "@shbooks/common";
import { OrderPlacedListener } from "../../../src/events/listeners/order-placed-listener";
import OrderCollection from "../../../src/models/order";
import mongoose from "mongoose";

const setup = async () => {
  const listener = new OrderPlacedListener(NatsClientWrapper.instance);

  const data: any = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "alskdjf",
    userId: "alskdjf",
    status: OrderStatus.Placed,
    book: {
      id: "alskdfj",
      price: 10,
    },
  };

  // @ts-ignore
  const ack = jest.fn();

  return { listener, data, ack };
};

it("replicates the order info", async () => {
  const { listener, data, ack } = await setup();

  await listener.onData(data, ack);

  const order = await OrderCollection.findById(data.id);

  expect(order!.price).toEqual(data.book.price);
});

it("acks the message", async () => {
  const { listener, data, ack } = await setup();

  await listener.onData(data, ack);

  expect(ack).toHaveBeenCalled();
});
