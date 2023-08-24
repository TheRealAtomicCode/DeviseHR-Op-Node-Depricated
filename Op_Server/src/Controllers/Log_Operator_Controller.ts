import { Request, Response, Router } from 'express';
import {
  findOperatorByCredentials,
  genarateOperatorAuthToken,
  findOperatorAndReplaceRefreshToken,
} from '../Services/operator_services';
import auth from '../Middleware/auth';
import { AuthenticatedOpRequestI } from '../Types/OperatorRequestType';

const LogOperatorController = Router();

// * login operator
LogOperatorController.post(
  '/login',
  async (req: Request, res: Response) => {
    try {
      const me = await findOperatorByCredentials(
        req.body.email,
        req.body.password
      );

      const { token, refreshToken } = await genarateOperatorAuthToken(
        me
      );

      // * what the end user receives, NOT ACTUALLY DELETING THE TOKENS
      me.password_hash = 'Not available';
      me.refresh_tokens = [];

      res.status(200).send({
        data: me,
        token,
        refreshToken,
        success: true,
        message: '',
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        token: null,
        refreshToken: null,
        success: false,
        message: err.message,
      });
    }
  }
);

// * refresh
LogOperatorController.post(
  '/refresh',
  auth,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const { refreshedUser, newRefreshToken, newToken } =
        await findOperatorAndReplaceRefreshToken(
          req.userId!,
          req.decodedUser?.userRole!,
          req.body.refreshToken!
        );

      refreshedUser.password_hash = 'No Access';
      refreshedUser.refresh_tokens = [];

      res.status(200).send({
        data: refreshedUser,
        token: newToken,
        refreshToken: newRefreshToken,
        success: true,
        message: '',
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        token: null,
        refreshToken: null,
        success: false,
        message: err.message,
      });
    }
  }
);

export default LogOperatorController;
