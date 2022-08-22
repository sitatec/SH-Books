import {Document, Model, Schema, model} from 'mongoose';
import Password from '../security/password';

class UserType {
  constructor(public email: string, public password: string){}
}

interface UserDocument extends Document, UserType {}

interface UserModel extends Model<UserDocument> {
  build(user: UserType): UserDocument;
  insert(user: UserType): Promise<UserDocument>;
}

const RequiredStringSchema = {
  type: String,
  required: true,
};

const userSchema = new Schema({
  email: RequiredStringSchema,
  password: RequiredStringSchema,
});

userSchema.statics.build = (userData: UserType) => new User(userData);
userSchema.statics.insert = (...userData: UserType[]) => User.create(userData);
userSchema.pre("save", async function (done) {
  if(this.isModified("password")){
    const hashedPassword = await Password.hash(this.password!);
    this.password = hashedPassword;
  }
  done();
});

const User = model<UserDocument, UserModel>("User", userSchema);

export default User;