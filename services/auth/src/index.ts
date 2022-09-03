import { connect } from "mongoose";
import app from './app';

// TODO use appropriated log levels in the entire project

const startServer = async () => {
  console.log("Starting server...");
  try {
    ensureRequiredEnvSet();
    console.log("Connecting to mongo db...");
    await connect("mongodb://auth-db-cluster-ip:27017/auth");
    console.log("Successfully connected to mongo db.");
    app.listen(8080, () => console.log("Server started and listening on 8080"));
  } catch (error) {
    console.error("Failed to start the server:\n", error);
    process.exit(1);
  }
};

const ensureRequiredEnvSet = () => {
  if(!process.env.JWT_KEY){
    console.error('JWT_KEY environment variable must be define!');
    process.exit(1);
  }
}

startServer();
