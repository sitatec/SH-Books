import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../src/app";
import { Book, cleanDB, EventChannel, generateValidMongoId, NatsClientWrapper, signup, User } from "@shbooks/common";
import BookCollection from "../../src/models/book";
import mongoose from "mongoose";

const user: User = {
  id: "id",
  email: "sita@shbooks.com",
  password: "ljfslS4Rfl",
  firstName: "first",
  lastName: "last",
};

const book = {
  title: "ttl",
  description: "desc",
  price: 32.0,
  sellerId: user.id,
  imageUrl: "url",
  authorName: "author",
};

const ensureNoBookCreated = async () => {
  const response = await BookCollection.findOne();
  expect(response).toBeNull();
};

const authenticatedRequest = (
  bookId: string = generateValidMongoId(),
  seller: User = user
) =>
  supertest(app)
    .put("/api/books/" + bookId)
    .set("Cookie", [signup(seller)]);

beforeEach(cleanDB);

it("Should return 404(NOT_FOUND) if the given id doesn't exist", async () => {
  const response = await authenticatedRequest(generateValidMongoId()).send({});
  expect(response.status).not.toEqual(StatusCodes.NOT_FOUND);
});

it("Should not allow unauthenticated PUT request on the `/api/books` endpoint", async () => {
  const response = await supertest(app).put("/api/books/id").send();
  expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
});

it("Should allow authenticated PUT request on the `/api/books/:id` endpoint", async () => {
  const response = await authenticatedRequest(generateValidMongoId()).send();
  expect(response.status).not.toEqual(StatusCodes.UNAUTHORIZED);
});

it("Should not allow empty title", async () => {
  const requests = [
    authenticatedRequest()
      .send({
        title: "",
        description: "desc",
        price: 32.0,
        sellerId: "id",
        imageUrl: "url",
        authorName: "author",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest()
      .send({
        description: "desc",
        price: 32.0,
        sellerId: "id",
        imageUrl: "url",
        authorName: "author",
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should not allow empty description", async () => {
  const requests = [
    authenticatedRequest()
      .send({
        title: "title",
        description: "",
        price: 32.0,
        sellerId: "id",
        imageUrl: "url",
        authorName: "author",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest()
      .send({
        title: "title",
        price: 32.0,
        sellerId: "id",
        imageUrl: "url",
        authorName: "author",
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should not allow empty price", async () => {
  const requests = [
    authenticatedRequest()
      .send({
        title: "title",
        description: "desc",
        price: 0,
        sellerId: "id",
        imageUrl: "url",
        authorName: "author",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest()
      .send({
        title: "title",
        description: "desc",
        sellerId: "id",
        imageUrl: "url",
        authorName: "author",
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should not allow empty imageUrl", async () => {
  const requests = [
    authenticatedRequest()
      .send({
        title: "title",
        description: "desc",
        price: 3,
        sellerId: "id",
        imageUrl: "",
        authorName: "author",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest()
      .send({
        title: "title",
        description: "desc",
        sellerId: "id",
        price: 3,
        authorName: "author",
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should not allow empty authorName", async () => {
  const requests = [
    authenticatedRequest()
      .send({
        title: "title",
        description: "desc",
        price: 3,
        sellerId: "id",
        imageUrl: "url",
        authorName: "",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest()
      .send({
        title: "title",
        description: "desc",
        sellerId: "id",
        price: 3,
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should fail update an book by a user different than the seller how created it", async () => {
  const createdBook = await BookCollection.insert(book as Book); // The sellerId of book is the id of the user defined at the to of this file
  const otherUser = {
    ...user,
    id: "other_id", // Changing id
  };

  await authenticatedRequest(createdBook.id, otherUser)
    .send({ ...book, title: "newTitle" })
    .expect(StatusCodes.UNAUTHORIZED);
});

it("Should update a book", async () => {
  const createdBook = await BookCollection.insert(book as Book);

  const newBook = { ...book, title: "newTitle", description: "newDescription" };

  await authenticatedRequest(createdBook.id)
    .send(newBook)
    .expect(StatusCodes.OK);

  const bookFromDb = await BookCollection.findById(createdBook);
  expect(bookFromDb?.title).toEqual(newBook.title);
  expect(bookFromDb?.description).toEqual(newBook.description);

  expect(NatsClientWrapper.instance.natsClient.publish).toHaveBeenNthCalledWith(
    1,
    EventChannel.BookUpdated,
    JSON.stringify(bookFromDb),
    expect.any(Function)
  );
});
