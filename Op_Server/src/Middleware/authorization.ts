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
  throw new Error('Access Denied, only Admins.');
};

const isManager = (
  req: AuthenticatedOpRequestI,
  res: Response,
  next: NextFunction
) => {
  if (
    req.decodedUser?.userRole === 'root' ||
    req.decodedUser?.userRole === 'sudo' ||
    req.decodedUser?.userRole === 'admin' ||
    req.decodedUser?.userRole === 'manager'
  )
    return next();
  throw new Error('Access Denied, only Managers.');
};

export { isAdmin, isManager };
