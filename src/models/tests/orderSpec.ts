import { Order, OrderStore } from "../order";
import { Product, ProductStore } from "../product";
import { User, UserStore } from "../user";

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe("Order Model", () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  let order: Order;
  let user: User;
  let product: Product;

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    user = await userStore.create({
      first_name: "Maria Fernando",
      last_name: "Castillo",
      email: "noestoycreici@gmail.com",
      password: "awrawriwra",
    });

    product = await productStore.create({
      name: "Shoes",
      price: 50,
      category: "footwear",
    });
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("create method should create a new empty order with user id", async () => {
    order = await store.create(user.id as string);
    expect(order).toBeDefined();
  });

  it("index method should return one order", async () => {
    const result = await store.index();
    expect(result.length).toEqual(1);
  });

  it("should add product to the order with provided id", async () => {
    const quantity = 3;
    const update = await store.addProduct(
      order.id as string,
      product.id as string,
      quantity
    );
    expect(update).toBeDefined();

    const updatedOrder = await store.show(order.id as string);
    expect(updatedOrder.products).toContain({ quantity, id: product.id });
  });

  it("show method should return order with provided id", async () => {
    const showOrder = await store.show(order.id as string);
    expect(showOrder.id).toEqual(order.id);
  });

  it("should return active orders by user", async () => {
    const orders = await store.ordersByUser(user.id as string, "active");
    expect(orders.length).toEqual(1);
  });

  it("should return complete orders by user", async () => {
    const orders = await store.ordersByUser(user.id as string, "complete");
    expect(orders.length).toEqual(0);
  });

  it("should update order status to complete", async () => {
    const completeOrder = await store.completeOrder(order.id as string);
    expect(completeOrder.status).toEqual("complete");
  });
});
