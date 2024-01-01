import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { IAuthenticatedOpRequest } from '../Types/OperatorRequestType';
import { DecodedToken } from '../Types/GeneralTypes';

const refreshAuth = async (
  req: IAuthenticatedOpRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    const urlToken = req.query['from-url']
      ?.toString()
      .replace('Bearer ', '');
    const cookieToken = req.cookies['from-cookie']
      ?.toString()
      .replace('Bearer ', '');

    if (!urlToken) throw new Error('Please Authenticate');
    const decode = (await verify(
      urlToken,
      process.env.JWT_REFRESH_SECRET!
    )) as DecodedToken;

    req.decodedUser = decode;
    req.userId = Number(decode.id);

    next();
  } catch (err: any) {
    res.status(400).send({
      data: null,
      success: false,
      message: err.message,
    });
  }
};

export default refreshAuth;
