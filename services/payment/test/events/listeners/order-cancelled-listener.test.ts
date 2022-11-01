import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, NatsClientWrapper } from "@shbooks/common";
import { OrderCancelledListener } from "../../../src/events/listeners/order-cancelled-listener";
import OrderCollection from "../../../src/models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(NatsClientWrapper.instance);

  const order = OrderCollection.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Placed,
    price: 10,
    userId: "asldkfj",
    version: 0,
  });
  await order.save();

  const data: any = {
    id: order.id,
    version: 1,
    book: {
      id: "asldkfj",
    },
  };

  // @ts-ignore
  const ack = jest.fn();

  return { listener, data, ack, order };
};

it("updates the status of the order", async () => {
  const { listener, data, ack, order } = await setup();

  await listener.onData(data, ack);

  const updatedOrder = await OrderCollection.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it("acks the message", async () => {
  const { listener, data, ack, order } = await setup();

  await listener.onData(data, ack);

  expect(ack).toHaveBeenCalled();
});
