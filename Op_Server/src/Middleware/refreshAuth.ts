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
    const urlToken = req.query['from-url'];
    const cookieToken = req.query['from-cookie'];
    let decodedToken: DecodedToken | null = null;
    let returnedToken: string | null = null;

    if (!urlToken && !cookieToken) {
      throw new Error('Please Authenticate');
    }

    if (urlToken && cookieToken) {
      const verifyTokenAndSetDecodedUser = async (token: string) => {
        try {
          decodedToken = (await verify(
            token.toString().replace('Bearer ', ''),
            process.env.JWT_REFRESH_SECRET!
          )) as DecodedToken;

          returnedToken = token;
          return true; // Token verification succeeded
        } catch (error) {
          console.error('Token verification failed:', error);
          return false; // Token verification failed
        }
      };

      // Try cookieToken verification first
      const isCookieTokenVerified =
        await verifyTokenAndSetDecodedUser(cookieToken.toString());

      if (!isCookieTokenVerified) {
        // If cookieToken verification failed, try urlToken verification
        await verifyTokenAndSetDecodedUser(urlToken.toString());
      }
    }

    if (urlToken && !cookieToken) {
      decodedToken = (await verify(
        urlToken.toString().replace('Bearer ', ''),
        process.env.JWT_REFRESH_SECRET!
      )) as DecodedToken;

      returnedToken = urlToken.toString();
    }

    if (!urlToken && cookieToken) {
      decodedToken = (await verify(
        cookieToken.toString().replace('Bearer ', ''),
        process.env.JWT_REFRESH_SECRET!
      )) as DecodedToken;

      returnedToken = cookieToken.toString();
    }

    if (!decodedToken || !returnedToken)
      throw new Error('Please Authenticate');

    req.decodedUser = decodedToken;
    req.userId = Number(decodedToken!.id);
    req.refreshToken = returnedToken;

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
