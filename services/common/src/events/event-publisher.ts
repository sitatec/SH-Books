import { Stan } from "node-nats-streaming";
import { Event } from "./event";

export class EventPublisher {
  constructor(private client: Stan) {}

  publish(event: Event) {
    return new Promise<void>((resolve, reject) => {
      const data = this._parseData(event.data);
      this.client.publish(event.channel, data, (error) => {
        const eventString = JSON.stringify(event);
        if (error) {
          reject(error);
          console.error("Failed to publish event ", eventString);
        } else {
          resolve();
          console.log("Successfully published event ", eventString);
        }
      });
    });
  }

  private _parseData(data: any) {
    return JSON.stringify(data);
  }
}
