import { NextFunction, Response } from 'express';
import { AuthenticatedOpRequestI } from '../Types/OperatorRequestType';

const isAdmin = (
  req: AuthenticatedOpRequestI,
  res: Response,
  next: NextFunction
) => {
  if (
    req.decodedUser?.userRole === 'root' ||
    req.decodedUser?.userRole === 'sudo' ||
    req.decodedUser?.userRole === 'admin'
  )
    return next();
  throw new Error('Access Denied.');
};

export { isAdmin };
