import { Response, Router } from 'express';
import auth from '../../Middleware/auth';
import { isAdmin } from '../../Middleware/authorization';
import { AuthenticatedOpRequestI } from '../../Types/OperatorRequestType';
import { createCompany } from '../../Services/Company-services/company_service';

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
