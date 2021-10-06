import sinon from "sinon";
import * as authMiddleware from "../middleware";

export const authMiddlewareStub = sinon
  .stub(authMiddleware, "verifyAuthToken")
  .callsFake((req, res, next) => next());
