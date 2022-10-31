import { Book } from "./book";

export interface Order {
  id: string;
  userId: string;
  book: Book;
  status: OrderStatus;
  placedAt: Date;
}

export enum OrderStatus {
  /**
   * When the order is placed but the book have not been reserved/blocked by the system yet
   */
  Placed = "Placed",

  /**
   * When the user manually cancel the order
   */
  Canceled = "Canceled",

  /**
   * When the order has been placed, the book is reserved until the user pay
   * or the order expires.
   */
  AwaitingPayment = "AwaitingPayment",

  /**
   * When the order have been placed, the corresponding book have been reserved
   * bot the user didn't make the payment at time.
   */
  Expired = "Expired",

  /**
   * When the user successfully make the payment.
   */
  Completed = "Completed",

}
