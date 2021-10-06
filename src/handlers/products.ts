import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import { verifyAuthToken } from "./middleware";

export const store = new ProductStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const product = await store.show(id);
  res.json(product);
};

const create = async (req: Request, res: Response): Promise<void> => {
  const newProduct: Product = req.body;
  try {
    const products = await store.create(newProduct);
    res.json(products);
  } catch (err) {
    res
      .status(400)
      .send(`Product ${newProduct.name} could not be created: ${err}`);
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedProduct = await store.delete(id);
    res.json(deletedProduct);
  } catch (err) {
    res.status(400).send(`Product with id ${id} could not be deleted: ${err}`);
  }
};

const productRoutes = (app: express.Application): void => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
  app.delete("/products/:id", verifyAuthToken, destroy);
};

export default productRoutes;
