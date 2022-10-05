import { Message, Stan } from "node-nats-streaming";
import { Event } from "./event";
import { EventChannel } from "./event-channel";

export abstract class EventListener<E extends Event> {
  constructor(
    private client: Stan,
    private channel: E['channel'],
    private queueGroupName: string,
    private ackWaitTime = 10 * 1000
  ) {}

  abstract onData(data: E['data'], ack: () => void): void;

  listen() {
    this._subscription.on("message", (message: Message) => {
      this.onData(this._getData(message), message.ack);
    });
  }

  private get _subscription() {
    return this.client.subscribe(
      this.channel,
      this.queueGroupName,
      this._subscriptionOptions
    );
  }

  private get _subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName)
      .setManualAckMode(true)
      .setAckWait(this.ackWaitTime);
  }

  private _getData(message: Message) {
    let data = message.getData();
    if (typeof data != "string") {
      data = data.toString("utf-8");
    }
    return JSON.parse(data as string);
  }
}
