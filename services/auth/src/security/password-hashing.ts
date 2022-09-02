import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(_scrypt);

export const hashPassword = async (password: string) => {
  const salt = randomBytes(8).toString("hex");
  const hashedPassword = await scrypt(password, salt);
  return `${hashedPassword}.${salt}`;
};

export const verifyPassword = async (password: string, hash: string) => {
  const [hashedPassword, salt] = hash.split(".");
  return (await scrypt(password, salt)) === hashedPassword;
};

const scrypt = async (password: string, salt: string) => {
  const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
  return buffer.toString("hex");
};
