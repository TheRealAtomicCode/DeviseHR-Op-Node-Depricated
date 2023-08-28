import { Response, Router } from 'express';
import auth from '../../Middleware/auth';
import { isManager } from '../../Middleware/authorization';
import { AuthenticatedOpRequestI } from '../../Types/OperatorRequestType';
import { getUserById } from '../../Services/Company-services/admin_company_service';
import { updateEmailById } from '../../Services/Company-services/manager_company_services';

const manageCompanyRouter = Router();

// * Create company
manageCompanyRouter.patch(
  '/edit-email',
  auth,
  isManager,
  async (req: AuthenticatedOpRequestI, res: Response) => {
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

export default manageCompanyRouter;
