import { Request, Response, Router } from 'express';
import { isEmptyObject } from '../../Helpers/isEmptyObject';
import {
  createPassword,
  getAndCheckRegistrationProfile,
} from '../../Services/Operator-Services/register_operator_services';
import { genarateOperatorRegistrationToken } from '../../Services/Operator-Services/operator_services';
import auth from '../../Middleware/auth';

const OperatorRegistrationController = Router();

// * register my account step 1
OperatorRegistrationController.get(
  '/register',
  async (req: Request, res: Response) => {
    try {
      if (!req.query.operatorId || !req.query.code)
        throw new Error('Invalid Request.');

      const operator = await getAndCheckRegistrationProfile(
        Number(req.query.operatorId),
        String(req.query.code)
      );

      const registrationToken =
        await genarateOperatorRegistrationToken(operator.id);

      res.status(200).send({
        id: operator.id,
        registrationToken,
      });
    } catch (err: any) {
      if (isEmptyObject(err)) res.status(400).send(err.message);
      else res.status(400).send(err);
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
        Number(req.query.operatorId),
        String(req.query.code)
      );

      const registrationToken =
        await genarateOperatorRegistrationToken(operator.id);

      res.status(200).send({
        id: operator.id,
        registrationToken,
      });
    } catch (err: any) {
      if (isEmptyObject(err)) res.status(400).send(err.message);
      else res.status(400).send(err);
    }
  }
);

// ! MAKE THIS WORK WITH THE AUTH MIDDLEWARE AFTER CLIENT COMPLETE
// * regester my account step 2 - confirm registration
OperatorRegistrationController.patch(
  '/registeration-confirmed',
  auth,
  async (req: Request, res: Response) => {
    try {
      const updatedOperator = await createPassword(
        Number(req.body.operatorId),
        req.body.password,
        req.body.verificationCode,
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
  async (req: Request, res: Response) => {
    try {
      const updatedOperator = await createPassword(
        Number(req.body.operatorId),
        req.body.password,
        req.body.verificationCode,
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
