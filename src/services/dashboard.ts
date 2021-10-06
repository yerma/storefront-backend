import Client from "../database";

export class DashboardQueries {
  async topProducts(
    limit: number = 5
  ): Promise<{ id: string; name: string; total_quantity: number }[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT products.id, products.name, SUM(order_products.quantity) as total_quantity
        FROM products, order_products
        WHERE products.id = order_products.product_id
        GROUP BY products.id ORDER BY SUM(order_products.quantity) DESC
        LIMIT ($1);`;
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows as unknown as {
        id: string;
        name: string;
        total_quantity: number;
      }[];
    } catch (err) {
      throw new Error(`Error fetching top ${limit} products: ${err}`);
    }
  }
}
