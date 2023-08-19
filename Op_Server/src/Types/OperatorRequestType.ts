import { Request } from 'express';
import { DecodedToken } from './GeneralTypes';

export interface AuthenticatedOpRequestI extends Request {
  decodedUser?: DecodedToken;
  userId?: number;
}
