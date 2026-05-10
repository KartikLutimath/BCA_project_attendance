import { AccessTokenPayload } from "@/utils/jwt.utils";

// Augment Express Request to include the decoded JWT user payload
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
