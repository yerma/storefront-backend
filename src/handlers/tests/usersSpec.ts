import express, { json } from "express";
import supertest from "supertest";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import { store } from "../users";
import * as authMiddleware from "../middleware";

const user = {
  id: "1",
  first_name: "Maria Fernando",
  last_name: "Castillo",
  email: "noestoycreici@gmail.com",
  password: "awrawriwra",
};

const authMiddlewareStub = sinon
  .stub(authMiddleware, "verifyAuthToken")
  .callsFake((req, res, next) => next());

const app = express();
app.use(json());
import userRoutes from "../users";
userRoutes(app);
const request = supertest(app);

describe("Users handler specs", () => {
  describe("GET /users", () => {
    it("should fetch list of users", async () => {
      sinon.stub(store, "index").resolves([user]);
      const response = await request.get("/users");
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(1);
      sinon.assert.called(authMiddlewareStub);
    });
  });

  describe("GET /users/:id", () => {
    it("should fetch user by id", async () => {
      const stub = sinon.stub(store, "show").resolves(user);
      const response = await request.get("/users/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
      sinon.assert.calledWith(stub, "1");
    });
  });

  describe("POST /users", () => {
    it("should create user", async () => {
      const stub = sinon.stub(store, "create").resolves(user);
      const response = await request
        .post("/users")
        .send(user)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
      sinon.assert.calledWith(stub, user);
    });
  });

  describe("POST /authenticate", () => {
    it("should authenticate user", async () => {
      const token = "adsfasdf";
      const loginInfo = { email: "test@test.com", password: "awrawriwra" };
      const storeStub = sinon.stub(store, "authenticate").resolves(user);
      const jwtStub = sinon.stub(jwt, "sign").resolves(token);

      const response = await request
        .post("/authenticate")
        .send(loginInfo)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      sinon.assert.calledWith(storeStub, loginInfo.email, loginInfo.password);
      sinon.assert.called(jwtStub);
    });
  });
});
