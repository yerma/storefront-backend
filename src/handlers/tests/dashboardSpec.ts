import supertest from "supertest";
import sinon from "sinon";
import app from "../../server";
import { dashboard } from "../dashboard";

const products = [
  { id: "1", name: "High-heel shoes", total_quantity: 3 },
  { id: "2", name: "High-heel shoes", total_quantity: 2 },
  { id: "3", name: "High-heel shoes", total_quantity: 1 },
];

const request = supertest(app);

describe("Dashboard handler specs", () => {
  describe("GET /top-products", () => {
    it("should fetch top n products", async () => {
      const limit = 3;
      sinon.stub(dashboard, "topProducts").resolves(products);
      const response = await request.get(`/top-products?limit=${limit}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toEqual(limit);
    });
  });
});
