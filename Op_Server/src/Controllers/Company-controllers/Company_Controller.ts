import { Response, Router } from 'express';
import auth from '../../Middleware/auth';
import { AuthenticatedOpRequestI } from '../../Types/OperatorRequestType';
import {
  findCompany,
  findUsers,
} from '../../Services/Company-services/company-services';

const companyRouter = Router();

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
