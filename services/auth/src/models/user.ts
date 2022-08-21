import {Document, Model, Schema, model} from 'mongoose';

class UserType {
  constructor(public email: string, public password: string){}
}

interface UserDocument extends Document, UserType {}

interface UserModel extends Model<UserDocument> {
  build(user: UserType): UserDocument;
  insert(user: UserType): Promise<UserDocument>;
}


const RequiredString = {
  type: String,
  required: true,
};
const userSchema = new Schema({
  email: RequiredString,
  password: RequiredString,
});

userSchema.statics.build = (userData: UserType) => new User(userData);
userSchema.statics.insert = (...userData: UserType[]) => User.create(userData);

const User = model<UserDocument, UserModel>("User", userSchema);

export default User;