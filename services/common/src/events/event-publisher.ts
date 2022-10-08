import { Stan } from "node-nats-streaming";
import { Event } from "./event";

export class EventPublisher {
  constructor(private client: Stan) {}

  publish(event: Event) {
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

  private _parseData(data: any) {
    return JSON.stringify(data);
  }
}
