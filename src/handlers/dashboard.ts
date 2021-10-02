import express, { Request, Response } from 'express'
import { DashboardQueries } from '../services/dashboard'

export const dashboard = new DashboardQueries()

const topProducts = async (req: Request, res: Response ) => {
  const { limit } = req.query
  try {
    const topProducts = await dashboard.topProducts(parseInt(limit as string))
    res.json(topProducts)
  } catch (err) {
    res.status(400).send(`Error fetching top ${limit} products`)
  }
}

const dashboardRoutes = (app: express.Application) => {
  app.get('/top-products', topProducts) // Use query param 'limit' to limit number of results
}

export default dashboardRoutes
