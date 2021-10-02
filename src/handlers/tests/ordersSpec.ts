import supertest from 'supertest'
import sinon from 'sinon'
import app from '../../server'
import { store } from '../orders'

const product = { id: '1', quantity: 2 }

const order = {
  "id": "1",
  "status": "active",
  "user_id": "1",
  products: [product]
}

const request = supertest(app)

describe('Order handler specs', () => {
  describe('GET /orders', () => {
    it('should fetch list of orders', async () => {
      sinon.stub(store, 'index').resolves([order])
      const response = await request.get('/orders')
      expect(response.status).toBe(200)
      expect(response.body.length).toEqual(1)
    })
  })

  describe('GET /orders/:id', () => {
    it('should fetch order by id', async () => {
      const stub = sinon.stub(store, 'show').resolves(order)
      const response = await request.get('/orders/1')
      expect(response.status).toBe(200)
      expect(response.body).toEqual(order)
      sinon.assert.calledWith(stub, '1')
    })
  })

  describe('PATCH /orders/:id/complete', () => {
    it('should mark order as complete', async () => {
      const orderId = '1'
      const completeOrder = {...order, status: 'complete' }
      const stub = sinon.stub(store, 'completeOrder').resolves(completeOrder)
      const response = await request.patch(`/orders/${orderId}/complete`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual(completeOrder)
      sinon.assert.calledWith(stub, orderId)
    })
  })

  describe('GET /users/:userId/orders', () => {
    it('should fetch orders by user', async () => {
      const userId = '1'
      const stub = sinon.stub(store, 'ordersByUser').resolves([order])
      const response = await request.get(`/users/${userId}/orders`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual([order])
      sinon.assert.calledWith(stub, userId)
    })
  })

  describe('POST /users/:userId/orders', () => {
    it('should create order for user', async () => {
      const userId = "1"
      const newOrder = {
        user_id: "1",
        status: "active"
      }
      const stub = sinon.stub(store, 'create').resolves(newOrder)
      const response = await request
        .post(`/users/${userId}/orders`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(newOrder)
      sinon.assert.calledWith(stub, userId)
    })
  })

  describe('POST /users/:userId/orders/:orderId', () => {
    it('should add products to order', async () => {
      const userId = "1"
      const orderId = "1"
      const productPayload = { ...product, productId: product.id }
      const orderProduct = {
        order_id: orderId,
        product_id: product.id,
        quantity: product.quantity 
      }

      const stub = sinon.stub(store, 'addProduct').resolves(orderProduct)
      const response = await request
        .post(`/users/${userId}/orders/${orderId}`)
        .send(productPayload)
        .set('Accept', 'application/json')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(orderProduct)
      sinon.assert.calledWith(stub, orderId, product.id, product.quantity)
    })
  })
})
