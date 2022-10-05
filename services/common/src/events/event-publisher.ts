import { Stan } from "node-nats-streaming";
import { Event } from "./event";
import { EventChannel } from "./event-channel";

export abstract class EventPublisher<E extends Event> {
  constructor(private client: Stan, private channel: EventChannel) {}

  publish(data: E["data"]) {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(this.channel, this._parseData(data), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  _parseData(data: E["data"]) {
    return JSON.stringify(data);
  }
}
