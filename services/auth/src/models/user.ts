import { Document, Model, Schema, model, SchemaOptions } from "mongoose";
import { clearObjectOwnProperties } from "../utils/object_utils";
import { hashPassword } from "../security/password-hashing";

export interface UserType {
  email: string;
  password: string;
}

export interface UserDocument extends Document, UserType {}

export interface UserModel extends Model<UserDocument> {
  build(user: UserType): UserDocument;
  insert(user: UserType): Promise<UserDocument>;
}

const RequiredStringSchema = {
  type: String,
  required: true,
};

const toJson: SchemaOptions = {
  toJSON: {
    transform(document: UserDocument, returnValue) {
      clearObjectOwnProperties(returnValue); // remove mongo specific properties and naming conventions
      returnValue.id = document.id;
      returnValue.email = document.email;
    },
  },
};

const userSchema = new Schema(
  {
    email: RequiredStringSchema,
    password: RequiredStringSchema,
  },
  toJson
);

userSchema.statics.build = (userData: UserType) => new User(userData);
userSchema.statics.insert = (...userData: UserType[]) => User.create(userData);
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.password!);
    this.password = hashedPassword;
  }
  done();
});

const User = model<UserDocument, UserModel>("User", userSchema);

export default User;
