import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Client from "../database";
dotenv.config();

const pepper: string = process.env.BCRYPT_PASSWORD || "";
const saltRounds: string = process.env.SALT_ROUNDS || "";

export type User = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  password_digest?: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users;";
      const result = await conn.query(sql);
      conn.release();
      return result.rows as unknown as User[];
    } catch (err) {
      throw new Error(`Error fetching users: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM users WHERE id = ($1);";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0] as unknown as User;
    } catch (err) {
      throw new Error(`Error fetching user: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const { first_name, last_name, email, password } = user;
      const conn = await Client.connect();
      const passwordDigest = bcrypt.hashSync(
        password + pepper,
        parseInt(saltRounds)
      );
      const sql =
        "INSERT INTO users (first_name, last_name, email, password_digest) VALUES ($1, $2, $3, $4) RETURNING *;";
      const newUser = await conn.query(sql, [
        first_name,
        last_name,
        email,
        passwordDigest,
      ]);
      conn.release();
      return newUser.rows[0] as unknown as User;
    } catch (err) {
      throw new Error(`Error creating user: ${err}`);
    }
  }

  async edit(id: string, user: User): Promise<User> {
    try {
      const { first_name, last_name, email, password_digest } = user;
      const conn = await Client.connect();
      const sql =
        "UPDATE users SET first_name = ($2), last_name = ($3), email = ($4), password_digest = ($5) WHERE id = ($1) RETURNING *;";
      const editedUser = await conn.query(sql, [
        id,
        first_name,
        last_name,
        email,
        password_digest,
      ]);
      conn.release();
      return editedUser.rows[0] as unknown as User;
    } catch (err) {
      throw new Error(`Error editing users: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = "DELETE FROM users WHERE id = ($1) RETURNING *;";
      const deletedUser = await conn.query(sql, [id]);
      conn.release();
      return deletedUser.rows[0] as unknown as User;
    } catch (err) {
      throw new Error(`Error deleting users: ${err}`);
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const conn = await Client.connect();
    const sql = "SELECT * FROM users WHERE email = ($1);";
    const result = await conn.query(sql, [email]);

    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + pepper, user.password_digest)) {
        return user;
      }
    }
    return null; // User not found
  }
}
