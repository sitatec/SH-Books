import { generateValidMongoId } from "@shbooks/common";
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
  ]);
});

it("Should respond with 404(NOT_FOUND) if not book with the given id exist", async () => {
  await supertest(app)
    .get(`/api/books/${generateValidMongoId()}`)
    .expect(StatusCodes.NOT_FOUND);
});

it("Should return the book corresponding the given id", async () => {
  const response = await supertest(app)
    .get(`/api/books/${booksInDb[0].id}`)
    .expect(StatusCodes.OK);
    
  // BookDocument's createdAt field is not converted to string, whereas response.body
  // is parsed from Json where the date is String, so we are converting it to make the test pass
  response.body.createdAt = new Date(response.body.createdAt); 
  expect(response.body).toEqual(booksInDb[0].toJSON());
});
