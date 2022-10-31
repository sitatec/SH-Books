export enum EventChannel {
  BookCreated = 'catalog:book-created',
  BookUpdated = 'catalog:book-updated',
  OrderPlaced = 'order:order-placed',
  OrderCanceled = 'order:order-canceled',
  JobQueued = 'job-queue:job-queued',
}