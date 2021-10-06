import { DashboardQueries } from "../dashboard";
import { Order, OrderStore } from "../../models/order";
import { Product, ProductStore } from "../../models/product";
import { User, UserStore } from "../../models/user";

const dashboard = new DashboardQueries();
const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("Dashboard Service", () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  let order: Order;
  let user: User;
  let productA: Product;
  let productB: Product;

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    user = await userStore.create({
      first_name: "Maria Fernando",
      last_name: "Castillo",
      email: "noestoycreici@gmail.com",
      password: "awrawriwra",
    });

    productA = await productStore.create({
      name: "Shoes",
      price: 50,
      category: "footwear",
    });
    productB = await productStore.create({
      name: "Socks",
      price: 5,
      category: "Underwear & Socks",
    });

    order = await orderStore.create(user.id as string);
    await orderStore.addProduct(order.id as string, productA.id as string, 3);
    await orderStore.addProduct(order.id as string, productB.id as string, 8);
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("should top products in descending order of popularity", async () => {
    const topProducts = await dashboard.topProducts(2);
    expect(topProducts[0].id).toEqual(productB?.id as string);
    expect(topProducts[1].id).toEqual(productA?.id as string);
  });
});
