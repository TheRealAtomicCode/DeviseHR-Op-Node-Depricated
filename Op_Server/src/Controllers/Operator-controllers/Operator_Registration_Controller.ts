import { Request, Response, Router } from 'express';
import { isEmptyObject } from '../../Helpers/isEmptyObject';
import {
  createPassword,
  getAndCheckRegistrationProfile,
} from '../../Services/Operator-Services/register_operator_services';
import auth from '../../Middleware/auth';
import { IAuthenticatedOpRequest } from '../../Types/OperatorRequestType';
import { genarateOperatorRegistrationToken } from '../../Functions/createTokens';

const OperatorRegistrationController = Router();

// * register my account step 1
OperatorRegistrationController.post(
  '/register',
  async (req: Request, res: Response) => {
    try {
      if (!req.body.operatorId || !req.body.code)
        throw new Error('Invalid Request.');

      const operator = await getAndCheckRegistrationProfile(
        Number(req.body.operatorId),
        String(req.body.code)
      );

      const registrationToken =
        await genarateOperatorRegistrationToken(operator.id);

      res.status(200).send({
        id: operator.id,
        registrationToken,
      });
    } catch (err: any) {
      if (isEmptyObject(err)) res.status(400).send(err.message);
      else
        res.status(400).send({
          data: null,
          success: false,
          message: err.message,
        });
    }
  }
);

// * reset my password step 1
OperatorRegistrationController.get(
  '/forgotten-password',
  async (req: Request, res: Response) => {
    try {
      if (!req.query.operatorId || !req.query.code)
        throw new Error('Invalid Request.');

      const operator = await getAndCheckRegistrationProfile(
        Number(req.body.operatorId),
        String(req.body.code)
      );

      const registrationToken =
        await genarateOperatorRegistrationToken(operator.id);

      res.status(200).send({
        id: operator.id,
        registrationToken,
      });
    } catch (err: any) {
      if (isEmptyObject(err)) res.status(400).send(err.message);
      res.status(400).send({
        data: null,
        success: false,
        message: err.message,
      });
    }
  }
);

// ! MAKE THIS WORK WITH THE AUTH MIDDLEWARE AFTER CLIENT COMPLETE
// * regester my account step 2 - confirm registration
OperatorRegistrationController.patch(
  '/registeration-confirmed',
  auth,
  async (req: IAuthenticatedOpRequest, res: Response) => {
    try {
      const updatedOperator = await createPassword(
        Number(req.userId),
        req.body.password,
        true
      );

      res.status(200).send(updatedOperator);
    } catch (err: any) {
      if (isEmptyObject(err)) res.status(400).send(err.message);
      else res.status(400).send(err);
    }
  }
);

// ! MAKE THIS WORK WITH THE AUTH MIDDLEWARE AFTER CLIENT COMPLETE
// * forgot password 2 - confirm reset password
OperatorRegistrationController.patch(
  '/reset-password-confermiation',
  auth,
  async (req: IAuthenticatedOpRequest, res: Response) => {
    try {
      const updatedOperator = await createPassword(
        Number(req.userId),
        req.body.password,
        false
      );

      res.status(200).send(updatedOperator);
    } catch (err: any) {
      if (isEmptyObject(err)) res.status(400).send(err.message);
      else res.status(400).send(err);
    }
  }
);

export default OperatorRegistrationController;
