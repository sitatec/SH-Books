import { Book } from "./book";

export interface Order {
  id: string;
  userId: string;
  book: Book;
  status: OrderStatus;
  placedAt: Date;
  expireAt: Date; // If order placed but no payment associated with the order is made for some period it will automatically be canceled
}

export enum OrderStatus {
  /**
   * When the order is placed but the book have not been reserved/blocked by the system yet
   */
  Placed = "placed",

  /**
   * When the user manually cancel the order
   */
  Canceled = "canceled",

  /**
   * When the order is placed and it corresponding boot have been successfully reserved by the system 
   */
  BookReserved = "book-reserved",

  /**
   * When the order is placed bot the system failed to reserve the corresponding book, whether because
   * the book have been already reserved (when 2+ users simultaneously try to place and order for the same book), or when
   * an error happened in the system.
   */
  BookReservationFailed = "book-reservation-failed",

  /**
   * When the user successfully make the payment.
   */
  Completed = "completed",

  /**
   * When the order have been placed, the corresponding book have been reserved
   * bot the user didn't make the payment at time.
   */
  Expired = "expired",
}
