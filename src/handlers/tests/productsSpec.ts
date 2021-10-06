import express, { json } from "express";
import supertest from "supertest";
import sinon from "sinon";
import { store } from "../products";
import { authMiddlewareStub } from "./middlewareMock";

const product = {
  id: "1",
  name: "High-heel shoes",
  price: 40_000,
  category: "shoes",
};

const app = express();
app.use(json());
import productRoutes from "../products";
productRoutes(app);
const request = supertest(app);

describe("Products handler specs", () => {
  afterEach(() => {
    authMiddlewareStub.resetHistory();
  });

  describe("GET /products", () => {
    it("should fetch list of products", async () => {
      sinon.stub(store, "index").resolves([product]);
      const response = await request.get("/products");
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(1);
    });
  });

  describe("GET /products/:id", () => {
    it("should fetch product by id", async () => {
      const stub = sinon.stub(store, "show").resolves(product);
      const response = await request.get("/products/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
      sinon.assert.calledWith(stub, "1");
    });
  });

  describe("POST /products", () => {
    it("should create product", async () => {
      const stub = sinon.stub(store, "create").resolves(product);
      const response = await request
        .post("/products")
        .send(product)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
      sinon.assert.calledWith(stub, product);
      sinon.assert.called(authMiddlewareStub);
    });
  });

  describe("POST /delete", () => {
    it("should delete product", async () => {
      const stub = sinon.stub(store, "delete").resolves(product);
      const response = await request.delete("/products/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
      sinon.assert.calledWith(stub, "1");
      sinon.assert.called(authMiddlewareStub);
    });
  });
});
