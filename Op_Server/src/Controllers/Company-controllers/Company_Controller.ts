import { Response, Router } from 'express';
import auth from '../../Middleware/auth';
import { AuthenticatedOpRequestI } from '../../Types/OperatorRequestType';
import {
  findCompany,
  findUsers,
  getCompanyById,
} from '../../Services/Company-services/company-services';
import { getUserById } from '../../Services/Company-services/admin_company_service';

const companyRouter = Router();

companyRouter.get(
  '/get-company/:id',
  auth,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const company = await getCompanyById(Number(req.params.id));
      res.status(200).send({
        data: company,
        message: '',
        success: true,
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        message: err.message,
        success: false,
      });
    }
  }
);

companyRouter.get(
  '/get-user/:id',
  auth,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const user = await getUserById(Number(req.params.id));
      res.status(200).send({
        data: user,
        message: '',
        success: true,
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        message: err.message,
        success: false,
      });
    }
  }
);

companyRouter.get(
  '/find-company-and-users',
  auth,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      if (req.query.searchTerm) {
        const searchTerm = String(req.query.searchTerm);
        const companies = await findCompany(searchTerm);
        const users = await findUsers(searchTerm);
        res.status(200).send({
          data: { companies, users },
          message: '',
          success: true,
        });
      } else {
        throw new Error('Please something to search for');
      }
    } catch (err: any) {
      res.status(400).send({
        data: null,
        message: err.message,
        success: false,
      });
    }
  }
);

export default companyRouter;
