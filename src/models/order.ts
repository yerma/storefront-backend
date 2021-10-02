import Client from '../database'

export type Order = {
  id?: string;
  status: string;
  user_id: string;
  products?: { id: string, quantity: number }[]
}

// Taken from https://itnext.io/query-nested-data-in-postgres-using-node-js-35e985368ea4
const nestedQuery = (query: string) => {
  return `coalesce(
    (
      SELECT array_to_json(array_agg(row_to_json(nestedObject)))
      FROM (${query}) nestedObject
    ), '[]'
  )
  `
}

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT o.id, o.user_id, o.status,
        ${nestedQuery(`SELECT op.product_id AS id, op.quantity FROM order_products AS op WHERE o.id = op.order_id`)} AS products
        FROM orders AS o;`
      const result = await conn.query(sql)
      conn.release()
      return result.rows as unknown as Order[]
    } catch (err) {
      throw new Error(`Error fetching orders: ${err}`)
    }
  }

  async ordersByUser(userId: string, status: string = ''): Promise<Order[]> {
    const statusQuery = status.length ? `AND o.status = '${status}'` : ''
    try {
      const conn = await Client.connect();
      const sql = `SELECT o.id, o.user_id, o.status,
        ${nestedQuery(`SELECT op.product_id AS id, op.quantity FROM order_products AS op WHERE o.id = op.order_id`)} AS products
        FROM orders AS o
        WHERE o.user_id = ($1) ${statusQuery};`
      const result = await conn.query(sql, [userId])
      conn.release()
      return result.rows as unknown as Order[]
    } catch (err) {
      throw new Error(`Error fetching orders: ${err}`)
    }
  }

  async show(orderId: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT o.id, o.user_id, o.status,
        ${nestedQuery(`SELECT op.product_id AS id, op.quantity FROM order_products AS op WHERE o.id = op.order_id`)} AS products
        FROM orders AS o
        WHERE o.id = ($1);`
      const result = await conn.query(sql, [orderId])
      conn.release()
      return result.rows[0] as unknown as Order
    } catch (err) {
      throw new Error(`Error fetching orders: ${err}`)
    }
  }

  async create (userId: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *;'
      const result = await conn.query(sql, ['active', userId])
      conn.release()
      return result.rows[0] as unknown as Order
    } catch (err) {
      throw new Error(`Error creating order for user ${userId}: ${err}`)
    }
  }

  async addProduct(orderId: string, productId: string, quantity: number) {
    try {
      const conn = await Client.connect()
      const ordersql = 'SELECT * FROM orders WHERE id=($1)'
      const result = await conn.query(ordersql, [orderId])
      const order = result.rows[0]
      if (order.status !== 'active') {
        throw new Error(`Could not add product ${productId} to order ${orderId} because order status is ${order.status}`)
      }
      conn.release()
    } catch (err) {
      throw new Error(`${err}`)
    }

    try {
      const conn = await Client.connect();
      const sql = "INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;"
      const result = await conn.query(sql, [orderId, productId, quantity])
      conn.release()
      return result.rows[0] as unknown as { order_id: string, product_id: string, quantity: number }
    } catch (err) {
      throw new Error(`Error adding products to order ${orderId}: ${err}`)
    }
  }

  async completeOrder(orderId: string) {
    try {
      const conn = await Client.connect();
      const sql = "UPDATE orders SET status = 'complete' WHERE id = ($1) RETURNING *;"
      const result = await conn.query(sql, [orderId])
      conn.release()
      return result.rows[0] as unknown as Order
    } catch (err) {
      throw new Error(`Error updating order ${orderId}: ${err}`)
    }
  }
}
