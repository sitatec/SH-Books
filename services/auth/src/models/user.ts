import { Document, Model, Schema, model, SchemaOptions } from "mongoose";
import { hashPassword } from "../security/password-hashing";
import { User as UserType, clearObjectOwnProperties } from "@shbooks/common";

export interface UserDocument extends Document, UserType {}

export interface UserModel extends Model<UserDocument> {
  build(user: UserType): UserDocument;
  insert(user: UserType): Promise<UserDocument>;
  insert(...user: UserType[]): Promise<UserDocument[]>;
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
      returnValue.fieldName = document.firstName;
      returnValue.lastName = document.lastName;
      returnValue.bio = document.bio;
      returnValue.profilePictureUrl = document.profilePictureUrl;
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
userSchema.statics.insert = (userData: UserType) => User.create(userData);
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.password!);
    this.password = hashedPassword;
  }
  done();
});

const User = model<UserDocument, UserModel>("User", userSchema);

export default User;
