import { Response, Router } from 'express';
import auth from '../../Middleware/auth';
import { isManager } from '../../Middleware/authorization';
import { IAuthenticatedOpRequest } from '../../Types/OperatorRequestType';
import {
  getUserById,
  updateUserVerificationToken,
} from '../../Services/Company-services/admin_company_service';
import {
  addUserToCompany,
  editExpiration,
  editMaxUserAmount,
  toggleTermination,
  updateEmailById,
  updateMainContact,
} from '../../Services/Company-services/manager_company_services';
import {
  generateVerificationCode,
  sendOperatorRagistration,
} from '../../Functions/node_mailer';

const manageCompanyRouter = Router();

// * Create company
manageCompanyRouter.patch(
  '/edit-email',
  auth,
  isManager,
  async (req: IAuthenticatedOpRequest, res: Response) => {
    try {
      const user = await updateEmailById(
        req.body.id,
        req.body.email,
        req.userId!
      );

      res.status(200).send({
        data: user,
        success: false,
        message: null,
      });
    } catch (err: any) {
      res.status(200).send({
        data: null,
        success: true,
        message: err.message,
      });
    }
  }
);

manageCompanyRouter.post(
  '/add-user-to-company',
  auth,
  isManager,
  async (req: IAuthenticatedOpRequest, res: Response) => {
    try {
      const addedUser = await addUserToCompany(req.body, req.userId!);

      if (req.body.sendRegistration) {
        const verificationCode = generateVerificationCode();
        const updatedOperator = await updateUserVerificationToken(
          addedUser.id,
          verificationCode
        );

        await sendOperatorRagistration(
          updatedOperator.id,
          updatedOperator.email,
          updatedOperator.first_name,
          updatedOperator.last_name,
          verificationCode
        );
      }

      res.status(200).send({
        data: addedUser,
        success: true,
        message: null,
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

manageCompanyRouter.patch(
  '/update-main-contact',
  auth,
  isManager,
  async (req: IAuthenticatedOpRequest, res: Response) => {
    try {
      const updatedCompany = await updateMainContact(
        req.body.companyId,
        req.body.userId,
        req.userId!
      );

      res.status(200).send({
        data: updatedCompany,
        success: true,
        message: null,
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

manageCompanyRouter.patch(
  '/toggle-termination',
  auth,
  isManager,
  async (req: IAuthenticatedOpRequest, res: Response) => {
    try {
      const updatedUser = await toggleTermination(
        req.body.userId,
        req.userId!
      );

      res.status(200).send({
        data: updatedUser,
        success: true,
        message: null,
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

manageCompanyRouter.patch(
  '/edit-expiration',
  auth,
  isManager,
  async (req: IAuthenticatedOpRequest, res: Response) => {
    try {
      const updatedUser = await editExpiration(
        req.body.companyId,
        req.body.expirationDate,
        req.userId!
      );

      res.status(200).send({
        data: updatedUser,
        success: true,
        message: null,
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

manageCompanyRouter.patch(
  '/edit-max-users',
  auth,
  isManager,
  async (req: IAuthenticatedOpRequest, res: Response) => {
    try {
      const updatedUser = await editMaxUserAmount(
        req.body.companyId,
        req.body.maxUsersAmount,
        req.userId!
      );

      res.status(200).send({
        data: updatedUser,
        success: true,
        message: null,
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

export default manageCompanyRouter;
