import { Book, clearObjectOwnProperties } from "@shbooks/common";
import { Document, model, Model, Schema, SchemaOptions } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface BookDocument extends Document, Omit<Book, "id"> {
  toModel(): Book;
  version: number;
}

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
      returnValue.version = document.version;
      returnValue.orderId = document.orderId;
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
    orderId: {
      type: String,
      require: false,
    },
  },
  schemaOptions
);

bookSchema.statics.build = (book: Book) => new BookCollection(book);
bookSchema.statics.insert = (book: Book) => BookCollection.create(book);
bookSchema.methods.toModel = function () {
  return this.toJSON();
};

// For optimistic concurrency control
bookSchema.set("versionKey", "version");
bookSchema.plugin(updateIfCurrentPlugin);

const BookCollection = model<BookDocument, BookModel>("Book", bookSchema);

export default BookCollection;
