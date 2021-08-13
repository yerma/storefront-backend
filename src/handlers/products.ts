import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'

const store = new ProductStore()

const index = async (_req: Request, res: Response): Promise<void> => {
  const products = await store.index()
  res.json(products)
}

const show = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const product = await store.show(id)
  res.json(product)
}

const create = async (req: Request, res: Response): Promise<void> => {
  const newProduct: Product = req.body;
  try {
    const products = await store.create(newProduct)
    res.json(products)
  } catch (err) {
    res.status(400).send(`Product ${newProduct.name} could not be created: ${err}`)
  }
}

const edit = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const updatedProduct = await store.edit(id, req.body as unknown as Product)
    res.json(updatedProduct)
  } catch (err) {
    res.status(400).send(`Product with id ${id} could not be updated: ${err}`)
  }
}

const destroy = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedProduct = await store.delete(id)
    res.json(deletedProduct)
  } catch (err) {
    res.status(400).send(`Product with id ${id} could not be deleted: ${err}`)
  }
}

const product_routes = (app: express.Application): void => {
  app.get('/products', index)
  app.get('/products/:id', show)
  app.post('/products', create)
  app.put('/products/:id', edit)
  app.delete('/products/:id', destroy)
}

export default product_routes;
