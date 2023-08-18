import { Request, Response, Router } from 'express';
import {
  getOperatorById,
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

// * login operator
LogOperatorController.post(
  '/refresh',
  auth,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      await findOperatorAndReplaceRefreshToken(
        req.userId!,
        req.decodedUser?.userRole!,
        req.body.refreshToken!
      );

      // if (!me) throw new Error('Please Authenticate');

      // const { token, refreshToken } = await genarateOperatorAuthToken(
      //   me
      // );

      res.status(200).send({
        data: 'me',

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
