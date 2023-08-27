import { Response, Router } from 'express';
import auth from '../../Middleware/auth';
import { isAdmin } from '../../Middleware/authorization';
import { AuthenticatedOpRequestI } from '../../Types/OperatorRequestType';
import {
  createCompany,
  updateCompanyVerificationToken,
} from '../../Services/Company-services/company_service';
import {
  generateVerificationCode,
  sendOperatorRagistration,
} from '../../Functions/node_mailer';

const companyRouter = Router();

// * Create company
companyRouter.post(
  '/create-company',
  auth,
  isAdmin,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const myId = req.userId!;
      const company = await createCompany(req.body, myId);

      if (req.body.sendRegistration) {
        const verificationCode = generateVerificationCode();
        const updatedOperator = await updateCompanyVerificationToken(
          company.users[0].id,
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
        data: company,
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

export default companyRouter;
