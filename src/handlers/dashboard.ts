import express, { Request, Response } from 'express'
import { DashboardQueries } from '../services/dashboard'

const dashboard = new DashboardQueries()

const topFiveProducts = async (req: Request, res: Response ) => {
  try {
    const topProducts = await dashboard.topFiveProducts()
    res.json(topProducts)
  } catch (err) {
    res.status(400).send(`Error fetching top five products`)
  }
}

const completedOrdersByUser = async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const orders = await dashboard.completedOrdersByUser(userId)
    res.json(orders)
  } catch (err) {
    res.status(400).send(`Error fetching top five products`)
  }
}

const dashboardRoutes = (app: express.Application) => {
  app.get('/top-five-products', topFiveProducts)
  app.get('/users/:userId/orders?completed', completedOrdersByUser)
}

export default dashboardRoutes
