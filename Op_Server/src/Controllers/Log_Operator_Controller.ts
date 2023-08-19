import { Request, Response, Router } from 'express';
import {
  getOperatorById,
  findOperatorByCredentials,
  genarateOperatorAuthToken,
  findOperatorAndReplaceRefreshToken,
} from '../Services/operator_services';
import auth from '../Middleware/auth';
import { AuthenticatedOpRequestI } from '../Types/OperatorRequestType';
import verifyAccess from '../Middleware/verify_access';

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

      verifyAccess(me.is_verified, me.is_terminated);

      const { token, refreshToken } = await genarateOperatorAuthToken(
        me
      );

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

// // * regester my account step 1
// LogOperatorController.get(
//   '/register',
//   async (req: Request, res: Response) => {
//     try {
//       const operator = await getAndCheckRegistrationProfile(
//         req.body.operatorId,
//         req.body.verificationCode
//       );

//       // res.status(200).render('registeration', {
//       //   firstName: agent?.firstName,
//       //   lastName: agent?.lastName,
//       //   email: agent?.email,
//       //   id: agent?.id,
//       //   verificationCode: verificationCode,
//       //   queriesExist,
//       // });
//     } catch (err: any) {
//       if (isEmptyObject(err)) res.status(400).send(err.message);
//       else res.status(400).send(err);
//     }
//   }
// );

export default LogOperatorController;
