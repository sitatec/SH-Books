import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../src/app";
import {
  cleanDB,
  EventChannel,
  NatsClientWrapper,
  signup,
  User,
} from "@shbooks/common";
import BookCollection from "../../src/models/book";

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

const authenticatedRequest = () =>
  supertest(app)
    .post("/api/books")
    .set("Cookie", [signup(user)]);

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
  const response = await authenticatedRequest().send();
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

// it("Should not allow empty imageUrl", async () => {
//   const requests = [
//     authenticatedRequest()
//       .send({
//         title: "title",
//         description: "desc",
//         price: 3,
//         sellerId: "id",
//         imageUrl: "",
//         authorName: "author",
//       })
//       .expect(StatusCodes.BAD_REQUEST),
//     authenticatedRequest()
//       .send({
//         title: "title",
//         description: "desc",
//         sellerId: "id",
//         price: 3,
//         authorName: "author",
//       })
//       .expect(StatusCodes.BAD_REQUEST),
//     ensureNoBookCreated(),
//   ];

//   await Promise.all(requests);
// });

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

it("Should create a book", async () => {
  const response = await authenticatedRequest()
    .send(book)
    .expect(StatusCodes.CREATED);

  expect(response.body).toMatchObject(book);
  expect(response.body.id).toBeTruthy();
  expect(response.body.sellerId).toEqual(user.id);
  expect(response.body.createdAt).toBeTruthy();

  const bookFromDb = await BookCollection.findById(response.body.id);
  expect(bookFromDb).toBeTruthy();
  expect(bookFromDb?.sellerId).toEqual(user.id);

  expect(NatsClientWrapper.instance.natsClient.publish).toHaveBeenNthCalledWith(
    1,
    EventChannel.BookCreated,
    JSON.stringify(bookFromDb),
    expect.any(Function)
  );
});
