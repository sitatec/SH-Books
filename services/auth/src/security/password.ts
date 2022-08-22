import {scrypt, randomBytes} from 'crypto';
import {promisify} from 'util';

const scryptAsync = promisify(scrypt);

export default abstract class Password {
  static async hash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const hashedPassword = Password.scrypt(password, salt);
    return `${hashedPassword}.${salt}`; 
  }

  static async compare(password: string, hash: string){
    const [hashedPassword, salt] = hash.split(".");
    return await Password.scrypt(password, salt) === hashedPassword;
  }

  private static async scrypt(password: string, salt: string){
    const buffer = (await scryptAsync(password, salt, 64) as Buffer);
    return buffer.toString("hex");
  }
}