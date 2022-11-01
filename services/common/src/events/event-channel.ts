export enum EventChannel {
  BookCreated = 'catalog:book-created',
  BookUpdated = 'catalog:book-updated',
  OrderPlaced = 'order:order-placed',
  OrderCanceled = 'order:order-canceled',
  OrderExpired = 'order:order-expired',
  OrderReservationTimeElapsed = 'order:order-reservation-time-elapsed',
  JobQueued = 'job-queue:job-queued',
  PaymentMade = "payment:payment-made",
}