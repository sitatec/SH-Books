import { Book, Order, OrderStatus, signup, User } from "@shbooks/common";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import BookCollection from "../../src/models/book";
import OrderCollection from "../../src/models/order";

const user: User = {
  id: "id",
  email: "sita@shbooks.com",
  password: "ljfslS4Rfl",
  firstName: "first",
  lastName: "last",
};

const fakeBook = {
  title: "ttl",
  description: "desc",
  price: 32.0,
  sellerId: user.id,
  imageUrl: "url",
  authorName: "author",
} as Book;

it("Should returns an error if the book does not exist", async () => {
  const bookId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signup(user))
    .send({ bookId })
    .expect(404);
});

it("Should returns an error if the book is already reserved", async () => {
  const book = (await BookCollection.insert(fakeBook)) as Book;

  const order = await OrderCollection.insert({
    book,
    userId: "laskdflkajsdf",
    status: OrderStatus.Placed,
    expiresAt: new Date(),
  });

  await request(app)
    .post("/api/orders")
    .set("Cookie", signup(user))
    .send({ bookId: book.id })
    .expect(400);
});

it("Should place an order", async () => {
  const book = await BookCollection.insert(fakeBook);

  await request(app)
    .post("/api/orders")
    .set("Cookie", signup(user))
    .send({ bookId: book.id })
    .expect(201);
});

it.todo("Should emits an order created event");
