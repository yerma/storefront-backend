import { Product, ProductStore } from "../product";

const store = new ProductStore();

describe("Product Model", () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  let product: Product;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("create method should create a product", async () => {
    product = await store.create({
      name: "Shoes",
      price: 50,
      category: "footwear",
    });
    expect(product).toBeDefined();
  });

  it("index method should return at least one product ", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return product with provided id", async () => {
    const showProduct = await store.show(product.id as string);
    expect(showProduct).toEqual(product);
  });

  it("edit method should update product with provided id", async () => {
    const edited = await store.edit(product.id as string, {
      ...product,
      price: 60,
    });
    expect(edited.price).not.toEqual(product.price);
  });

  it("delete method should delete product with provided id", async () => {
    const deleted = await store.delete(product.id as string);
    expect(deleted).toBeDefined();
  });
});
