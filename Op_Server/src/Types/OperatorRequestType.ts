import { Request } from 'express';
import { DecodedToken } from './GeneralTypes';

export interface IAuthenticatedOpRequest extends Request {
  decodedUser?: DecodedToken;
  userId?: number;
}

export interface IAddOperatorRequest {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface IUpdateOperatorRequestBody {
  opId: Number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface IUpdateOperatorRoleRequestBody {
  opId: Number;
  role: 'admin' | 'manager' | 'employee';
}

export interface ICreateOperatorRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
}

export interface IAddUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  userRole: 'admin' | 'manager' | 'employee';
  companyId: number;
  sendRegistration: boolean;
}
