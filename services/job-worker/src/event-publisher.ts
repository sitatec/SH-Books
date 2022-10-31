import {
  EventPublisher,
  NatsClientWrapper,
} from "@shbooks/common";
import { Event } from "@shbooks/common/lib/events/event";

let eventPublisher: EventPublisher;

export const publishEvent = async <E extends Event>(event: E) => {
  eventPublisher ||= new EventPublisher(NatsClientWrapper.instance.natsClient);

  await eventPublisher.publish(event);
};
