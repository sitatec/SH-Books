import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import app from "../../src/app";
import BookCollection, { Book, BookDocument } from "../../src/models/book";

const book = {
  title: "ttl",
  description: "desc",
  price: 32.0,
  sellerId: "id",
  imageUrl: "url",
  authorName: "author",
};

let booksInDb: BookDocument[];

beforeAll(async () => {
  booksInDb = await Promise.all([
    BookCollection.insert(book as Book),
    BookCollection.insert(book as Book),
    BookCollection.insert(book as Book),
    BookCollection.insert(book as Book),
    BookCollection.insert(book as Book),
  ]);
});

it("Should listen for get requests on the `/api/books` endpoint", async () => {
   const response = await supertest(app).get(`/api/books/`);

   expect(response.statusCode).not.toEqual(StatusCodes.NOT_FOUND);
});

it("Should return the book corresponding the given id", async () => {
  const response = await supertest(app).get(`/api/books/`);

  expect(response.body.length).toEqual(booksInDb.length);
});
