export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePictureUrl?: string;
  password: string;
}
