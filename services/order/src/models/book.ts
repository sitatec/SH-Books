import { Book, clearObjectOwnProperties, OrderStatus } from "@shbooks/common";
import { Document, model, Model, Schema, SchemaOptions } from "mongoose";
import OrderCollection from "./order";

export interface BookDocument extends Document, Omit<Book, "id"> {
  toBookModel(): Book;
  isReserved(): Promise<boolean>;
}

export interface BookModel extends Model<BookDocument> {
  build(book: Book): BookDocument;
  insert(book: Book): Promise<BookDocument>;
}

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
bookSchema.methods.toBookModel = function () {
  return this.toJSON();
};
bookSchema.methods.isReserved = async function () {
  // this === the book document that we just called 'isReserved' on
  const existingOrder = await OrderCollection.findOne({
    book: this,
    status: {
      $in: [
        OrderStatus.Placed,
        OrderStatus.BookReserved,
        OrderStatus.Completed,
      ],
    },
  });

  return !!existingOrder;
};

const BookCollection = model<BookDocument, BookModel>("Book", bookSchema);

export default BookCollection;
