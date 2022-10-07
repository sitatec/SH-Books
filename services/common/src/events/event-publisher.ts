import { Stan } from "node-nats-streaming";
import { Event } from "./event";

export abstract class EventPublisher {
  constructor(private client: Stan) {}

  publish<E extends Event>(event: E) {
    return new Promise<void>((resolve, reject) => {
      this.client.publish(
        event.channel,
        this._parseData(event.data),
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  _parseData(data: any) {
    return JSON.stringify(data);
  }
}
