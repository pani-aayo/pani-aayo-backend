import { IAuth } from './token.service';

declare global {
  namespace Express {
    interface Request {
      user?: IAuth;
    }
  }
}
