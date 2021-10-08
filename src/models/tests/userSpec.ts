import { User, UserStore } from "../user";

const store = new UserStore();

describe("User Model", () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  let user: User;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it("create method should create a user", async () => {
    user = await store.create({
      first_name: "Maria Fernando",
      last_name: "Castillo",
      email: "noestoycreici@gmail.com",
      password: "awrawriwra",
    });
    expect(user).toBeDefined();
  });

  it("index method should return at least one user ", async () => {
    const result = await store.index();
    expect(result.length).toBeGreaterThan(0);
  });

  it("show method should return user with provided id", async () => {
    const showUser = await store.show(user.id as string);
    expect(showUser).toEqual(user);
  });

  it("edit method should update user with provided id", async () => {
    const edited = await store.edit(user.id as string, {
      ...user,
      first_name: "Fernando",
    });
    expect(edited.first_name).not.toEqual(user.first_name);
  });

  it("delete method should delete user with provided id", async () => {
    const deleted = await store.delete(user.id as string);
    expect(deleted).toBeDefined();
  });
});
