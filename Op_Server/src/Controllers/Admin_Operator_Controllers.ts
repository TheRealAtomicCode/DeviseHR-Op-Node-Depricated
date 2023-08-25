import { Response, Router } from 'express';
import { AuthenticatedOpRequestI } from '../Types/OperatorRequestType';
import auth from '../Middleware/auth';
import { isAdmin } from '../Middleware/authorization';
import {
  generateVerificationCode,
  sendOperatorVerificationCode,
} from '../Functions/node_mailer';
import {
  createOperator,
  getAllOperators,
  getOperatorDetails,
  updateOperatorDetails,
  updateOperatorRole,
} from '../Services/admin_operator_services';
import { updateVerificationToken } from '../Services/operator_services';

const AdminOperatorConroller = Router();

// * Create Operator
AdminOperatorConroller.post(
  '/create-operator',
  auth,
  isAdmin,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const newOperator = await createOperator(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.role,
        req.userId!
      );

      if (req.body.sendRegistration) {
        const verificationCode = generateVerificationCode();
        const updatedOperator = await updateVerificationToken(
          newOperator.id,
          verificationCode
        );

        await sendOperatorVerificationCode(
          updatedOperator.id,
          updatedOperator.email,
          updatedOperator.first_name,
          updatedOperator.last_name,
          verificationCode
        );
      }

      res.status(200).send({
        data: newOperator,
        success: true,
        message: '',
      });
    } catch (err: any) {
      res.status(200).send({
        data: null,
        success: false,
        message: err.message,
      });
    }
  }
);

// * View operators
AdminOperatorConroller.get(
  '/operators',
  auth,
  isAdmin,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const operators = await getAllOperators();

      res.status(200).send({
        data: operators,
        success: false,
        message: null,
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        success: false,
        message: err.message,
      });
    }
  }
);

// * View operator details
AdminOperatorConroller.get(
  '/operators/:operatorId',
  auth,
  isAdmin,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const operators = await getOperatorDetails(
        Number(req.params.operatorId)
      );

      res.status(200).send({
        data: operators,
        success: false,
        message: null,
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        success: false,
        message: err.message,
      });
    }
  }
);

// * Edit User details
AdminOperatorConroller.patch(
  '/edit-operator',
  auth,
  isAdmin,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const updatedOperator = await updateOperatorDetails(
        req.body,
        req.userId!
      );

      res.status(201).send({
        data: updatedOperator,
        success: false,
        message: null,
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        success: false,
        message: err.message,
      });
    }
  }
);

// * Edit User role
AdminOperatorConroller.patch(
  '/edit-role',
  auth,
  isAdmin,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const updatedOperator = await updateOperatorRole(
        req.body,
        req.userId!
      );

      res.status(201).send({
        data: updatedOperator,
        success: false,
        message: null,
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        success: false,
        message: err.message,
      });
    }
  }
);

export default AdminOperatorConroller;
