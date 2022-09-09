import User from "../models/user";
import { HttpClient, HttpHeaders } from "./http-client";

export class AuthService {

 static instance = new AuthService();

  constructor(private httpClient = new HttpClient()){}

  public currentUser(headers: HttpHeaders = {}) {
    return this.httpClient.get("/api/users/currentuser", {headers});
  }

  public signIn(data: SignInData){
    return this.httpClient.get("/api/users/signin", {data});
  }

  public signUp(data: SignUpData){
    return this.httpClient.post("/api/users/signup", {data});
  }

  public signOut(){
    return this.httpClient.post("/api/users/signout");
  }
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData extends Omit<User, "id">{
  password: string;
}