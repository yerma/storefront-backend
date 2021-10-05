import express, { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User, UserStore } from '../models/user'
import { verifyAuthToken } from './middleware'

dotenv.config()
export const store = new UserStore()

const index = async (_req: Request, res: Response): Promise<void> => {
  const users = await store.index()
  res.json(users)
}

const show = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { password_digest, ...user} = await store.show(id)
  res.json(user)
}

const create = async (req: Request, res: Response): Promise<void> => {
  const newUser: User = req.body;
  try {
    const user = await store.create(newUser)
    res.json(user)
  } catch (err) {
    res.status(400).send(`User ${newUser.email} could not be created: ${err}`)
  }
}

const authenticate = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await store.authenticate(email, password)
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as Secret)
    res.json(token)
  } catch (err) {
    res.status(400).send(`User with email ${email} could not be authenticated: ${err}`)
  }
}

const userRoutes = (app: express.Application): void => {
  app.get('/users', verifyAuthToken, index)
  app.get('/users/:id', verifyAuthToken, show)
  app.post('/users', verifyAuthToken, create)
  app.post('/authenticate', authenticate)
}

export default userRoutes;
