import Client from "../database";

export type Product = {
  id?: string;
  name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM products;";
      const result = await conn.query(sql);
      conn.release();
      return result.rows as unknown as Product[];
    } catch (err) {
      throw new Error(`Error fetching products: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = "SELECT * FROM products WHERE id = ($1);";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0] as unknown as Product;
    } catch (err) {
      throw new Error(`Error fetching product: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const { name, price, category } = product;
      const conn = await Client.connect();
      const sql =
        "INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *;";
      const newProduct = await conn.query(sql, [name, price, category]);
      conn.release();
      return newProduct.rows[0] as unknown as Product;
    } catch (err) {
      throw new Error(`Error creating product: ${err}`);
    }
  }

  async edit(id: string, product: Product): Promise<Product> {
    try {
      const { name, price, category } = product;
      const conn = await Client.connect();
      const sql =
        "UPDATE products SET name = ($2), price = ($3), category = ($4) WHERE id = ($1) RETURNING *;";
      const updatedProduct = await conn.query(sql, [id, name, price, category]);
      conn.release();
      return updatedProduct.rows[0] as unknown as Product;
    } catch (err) {
      throw new Error(`Error updating product: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = "DELETE FROM products WHERE id = ($1) RETURNING *;";
      const deletedProduct = await conn.query(sql, [id]);
      conn.release();
      return deletedProduct.rows[0] as unknown as Product;
    } catch (err) {
      throw new Error(`Error deleting product: ${err}`);
    }
  }
}
