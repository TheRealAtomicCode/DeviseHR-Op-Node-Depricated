import { Request } from 'express';
import { DecodedToken } from './GeneralTypes';

export interface AuthenticatedOpRequestI extends Request {
  decodedUser?: DecodedToken;
  userId?: number;
}

export interface updateOperatorRequestBody {
  opId: Number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface updateOperatorRoleRequestBody {
  opId: Number;
  role: 'admin' | 'manager' | 'employee';
}
