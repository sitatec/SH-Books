import { clearObjectOwnProperties } from "@shbooks/common";
import { Document, model, Model, Schema, SchemaOptions } from "mongoose";

export interface Book {
  title: string;
  description: string;
  authorName: string;
  price: number;
  imageUrl: string;
  sellerId: string;
  createdAt: Date;
}

export interface BookDocument extends Document, Book {}

export interface BookModel extends Model<BookDocument> {
  build(book: Book): BookDocument;
  insert(book: Book): Promise<BookDocument>;
}

// TODO: move to `common` package
const RequiredStringSchema = {
  type: String,
  required: true,
};

const schemaOptions: SchemaOptions = {
  toJSON: {
    transform(document: BookDocument, returnValue) {
      clearObjectOwnProperties(returnValue); // remove mongo specific properties and naming conventions
      returnValue.id = document.id;
      returnValue.title = document.title;
      returnValue.description = document.description;
      returnValue.imageUrl = document.imageUrl;
      returnValue.sellerId = document.sellerId;
      returnValue.price = document.price;
      returnValue.createdAt = document.createdAt;
      returnValue.authorName = document.authorName;
    },
  },
  timestamps: true,
};

const bookSchema = new Schema(
  {
    title: RequiredStringSchema,
    description: RequiredStringSchema,
    imageUrl: RequiredStringSchema,
    sellerId: RequiredStringSchema,
    authorName: RequiredStringSchema,
    price: {
      type: Number,
      require: true,
    },
  },
  schemaOptions
);

bookSchema.statics.build = (book: Book) => new BookCollection(book);
bookSchema.statics.insert = (book: Book) => BookCollection.create(book);

const BookCollection = model<BookDocument, BookModel>("Book", bookSchema);

export default BookCollection;
