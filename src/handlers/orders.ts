import express, { Request, Response } from "express";
import { OrderStore } from "../models/order";

export const store = new OrderStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  const orders = await store.index();
  res.json(orders);
};

const show = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await store.show(id);
  res.json(order);
};

const create = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const createdOrder = await store.create(userId);
    res.json(createdOrder);
  } catch (err) {
    res
      .status(400)
      .send(`Order for user ${userId} could not be created: ${err}`);
  }
};

const addProducts = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { productId, quantity } = req.body;
  try {
    const createdOrder = await store.addProduct(
      orderId,
      productId,
      parseInt(quantity)
    );
    res.json(createdOrder);
  } catch (err) {
    res.status(400).send(`Could not add products to order ${orderId}: ${err}`);
  }
};

// Mark order as complete after payment
const completeOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const completedOrder = await store.completeOrder(id);
    res.json(completedOrder);
  } catch (err) {
    res.status(400).send(`Could not complete order ${id}: ${err}`);
  }
};

const ordersByUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { status = "" } = req.query;
  try {
    const orders = await store.ordersByUser(userId, status as string);
    res.json(orders);
  } catch (err) {
    res.status(400).send(`Error fetching orders for user ${userId}: ${err}`);
  }
};

const orderRoutes = (app: express.Application) => {
  app.get("/orders", index);
  app.get("/orders/:id", show);
  app.patch("/orders/:id/complete", completeOrder);
  app.get("/users/:userId/orders", ordersByUser); // use status query param to get either complete or active orders
  app.post("/users/:userId/orders", create);
  app.post("/users/:userId/orders/:orderId", addProducts);
};

export default orderRoutes;
