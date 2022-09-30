import { StatusCodes } from "http-status-codes";
import supertest, { Test } from "supertest";
import app from "../../src/app";
import { cleanDB, signup, User } from "@shbooks/common";
import BookCollection, { Book } from "../../src/models/book";

const user: User = {
  email: "sita@shbooks.com",
  password: "ljfslS4Rfl",
  firstName: "first",
  lastName: "last",
};

const book: Book = {
  title: "ttl",
  description: "desc",
  price: 32.0,
  sellerId: "id",
  imageUrl: "url",
};

const ensureNoBookCreated = async () => {
  const response = await BookCollection.findOne();
  expect(response).toBeNull();
};

let authenticatedRequest: Test;

beforeAll(() => {
  authenticatedRequest = supertest(app)
    .post("/api/books")
    .set("Cookie", [signup(user)]);
});

beforeEach(cleanDB);

it("Should listen to POST requests on the `/api/books` endpoint", async () => {
  const response = await supertest(app).post("/api/books").send();
  expect(response.status).not.toEqual(StatusCodes.NOT_FOUND);
});

it("Should not allow unauthenticated POST request on the `/api/books` endpoint", async () => {
  const response = await supertest(app).post("/api/books").send();
  expect(response.status).toEqual(StatusCodes.UNAUTHORIZED);
});

it("Should allow authenticated POST request on the `/api/books` endpoint", async () => {
  const response = await authenticatedRequest.send();
  expect(response.status).not.toEqual(StatusCodes.UNAUTHORIZED);
});

it("Should not allow empty title", async () => {
  const requests = [
    authenticatedRequest
      .send({
        title: "",
        description: "desc",
        price: 32.0,
        sellerId: "id",
        imageUrl: "url",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest
      .send({
        description: "desc",
        price: 32.0,
        sellerId: "id",
        imageUrl: "url",
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should not allow empty description", async () => {
  const requests = [
    authenticatedRequest
      .send({
        title: "title",
        description: "",
        price: 32.0,
        sellerId: "id",
        imageUrl: "url",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest
      .send({
        title: "title",
        price: 32.0,
        sellerId: "id",
        imageUrl: "url",
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should not allow empty price", async () => {
  const requests = [
    authenticatedRequest
      .send({
        title: "title",
        description: "desc",
        price: 0,
        sellerId: "id",
        imageUrl: "url",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest
      .send({
        title: "title",
        description: "desc",
        sellerId: "id",
        imageUrl: "url",
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should not allow empty imageUrl", async () => {
  const requests = [
    authenticatedRequest
      .send({
        title: "title",
        description: "desc",
        price: 3,
        sellerId: "id",
        imageUrl: "",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest
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

it("Should not allow empty sellerId", async () => {
  const requests = [
    authenticatedRequest
      .send({
        title: "title",
        description: "desc",
        price: 3,
        sellerId: "",
        imageUrl: "dsf",
      })
      .expect(StatusCodes.BAD_REQUEST),
    authenticatedRequest
      .send({
        title: "title",
        description: "desc",
        price: 3,
        imageUrl: "fsf",
      })
      .expect(StatusCodes.BAD_REQUEST),
    ensureNoBookCreated(),
  ];

  await Promise.all(requests);
});

it("Should create a book", async () => {
  const response = await authenticatedRequest
    .send(book)
    .expect(StatusCodes.CREATED);
    
  expect(response.body).toMatchObject(book);
  expect(response.body.id).toBeTruthy();
  
  const bookFromDb = await BookCollection.findById(response.body.id);
  expect(bookFromDb).toBeTruthy();
});
